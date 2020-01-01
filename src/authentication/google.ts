import { GraphQLServer } from "graphql-yoga";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../entity/User";
import { getConnection } from "typeorm";

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
        console.log("profile: ", profile);
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
          // new user -> create user
          console.log("creating user");
          user = await User.create({
            username: displayName,
            email,
            googleId: id
          }).save();
          console.log("saved!!!");
        } else if (!user.googleId) {
          // known user first sign in
          // using google -> update googleId
          user.googleId = id;
          await user.save();
        }
        console.log("user: ", user);

        return cb(undefined, { userId: user.id });
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
    (req, res) => {
      console.log("req: ", req);
      console.log("req.user.id: ", (req.user as any).id);
      // redirect to frontend -> page
      res.redirect("/");
    }
  );
};
