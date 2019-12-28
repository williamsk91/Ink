import bcrypt from "bcrypt";
import * as yup from "yup";

import { IResolverMap } from "./types/graphql-utils";
import { User } from "./entity/User";
import { formatYupError } from "./utils/formatYupError";
import { createConfirmEmailLink } from "./utils/createConfirmEmailLink";
import { createMiddleware } from "./utils/createMiddleware";
import middleware from "./middleware";

const schema = yup.object().shape({
  email: yup
    .string()
    .min(3)
    .max(255)
    .email(),
  password: yup
    .string()
    .min(6)
    .max(255)
});

const loginError = [
  {
    path: "email",
    message: "invalid login"
  }
];

const confirmEmailError = [
  {
    path: "email",
    message: "email is not confirmed"
  }
];

export const resolvers: IResolverMap = {
  Query: {
    me: createMiddleware(middleware, (_parent, _args, { session }) =>
      User.findOne({ where: { id: session.userId } })
    )
  },
  Mutation: {
    /**
     * Register a new user
     */
    register: async (_, args: GQL.IRegisterOnMutationArguments, { redis }) => {
      // validate args
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }

      // add user
      const { email } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });
      if (userAlreadyExists) {
        return [{ path: "email", message: "already taken" }];
      }

      // hashing is done in the user definition itself
      const user = User.create(args);

      await user.save();

      // send confirmation email
      const link = await createConfirmEmailLink("", user.id, redis);

      // send email

      return null;
    },
    /**
     * User login
     */
    login: async (
      _,
      { email, password }: GQL.ILoginOnMutationArguments,
      { session }
    ) => {
      // find by email
      const user = await User.findOne({ where: { email } });
      if (!user) return loginError;
      if (!user.confirmed) return confirmEmailError;

      // confirm password is correct
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return loginError;

      // login succesful
      session.userId = user.id;

      return null;
    },

    /**
     * User logout
     */
    logout: (_parent, _args, { session }) =>
      new Promise(res =>
        session.destroy(err => {
          if (err) {
            console.log("logout err: ", err);
          }

          res(true);
        })
      )
  }
};
