import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { GraphQLServer } from "graphql-yoga";
import { PageToUser } from "../entity/PageToUser";
import { User } from "../entity/User";
import { createBasePage } from "../resolvers";
import { getConnection } from "typeorm";
import passport from "passport";
import { setJWTCookie } from "./JWT";

export const useGoogleOauth = (server: GraphQLServer) => {
  /**
   * Oauth
   */
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "http://localhost:4000/auth/google/callback"
      },
      async (_accessToken, _refreshToken, profile, cb) => {
        const { id, emails, displayName } = profile;

        if (!emails) return cb("no email found");
        const email = emails[0].value;

        /**
         * Find user by `email` and `googleId`
         */
        const query = getConnection()
          .getRepository(User)
          .createQueryBuilder("user")
          .where("user.googleId = :id", { id })
          .orWhere("user.email = :email", { email });

        let user = await query.getOne();

        /**
         * Update user depending on user status
         */
        if (!user) {
          /**
           * new user -> create user and a base page
           */
          user = await User.create({
            username: displayName,
            email,
            googleId: id
          }).save();
          await createBasePage(user, []);
        } else if (!user.googleId) {
          // known user first sign in
          // using google -> update googleId
          user.googleId = id;
          await user.save();
        }

        return cb(undefined, user);
      }
    )
  );

  server.express.use(passport.initialize());

  server.express.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"]
    })
  );

  server.express.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    async (req, res) => {
      setJWTCookie(res, (req as any).user);

      // get a user page id
      const pageToUsers = await getConnection()
        .getRepository(PageToUser)
        .createQueryBuilder("pageToUser")
        .leftJoinAndSelect("pageToUser.page", "page")
        .leftJoinAndSelect("pageToUser.user", "user")
        .where("user.id = :userId", { userId: (req.user as User).id })
        .andWhere("page.deleted = FALSE")
        .getOne();

      // redirect to frontend -> page
      res.redirect(
        `${process.env.FRONTEND_HOST}/page/${
          pageToUsers ? pageToUsers.page.id : ""
        }`
      );
    }
  );
};
