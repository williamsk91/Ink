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

      return null;
    }
  }
};
