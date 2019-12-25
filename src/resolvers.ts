import bcrypt from "bcrypt";
import * as yup from "yup";

import { IResolverMap } from "./types/graphql-utils";
import { User } from "./entity/User";
import { formatYupError } from "./utils/formatYupError";
import { createConfirmEmailLink } from "./utils/createConfirmEmailLink";

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
    hello: (_, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello ${name || "World"}`
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
      const { email, password } = args;
      const userAlreadyExists = await User.findOne({
        where: { email },
        select: ["id"]
      });
      if (userAlreadyExists) {
        return [{ path: "email", message: "already taken" }];
      }

      const hashedPass = await bcrypt.hash(password, 10);

      const user = User.create({
        email,
        password: hashedPass
      });

      await user.save();

      // send confirmation email
      const link = await createConfirmEmailLink("", user.id, redis);

      // send email

      return null;
    },
    /**
     * User login
     */
    login: async (_, { email, password }: GQL.ILoginOnMutationArguments) => {
      // find by email
      const user = await User.findOne({ where: { email } });
      if (!user) return loginError;
      if (!user.confirmed) return confirmEmailError;

      // confirm password is correct
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return loginError;

      return null;
    }
  }
};
