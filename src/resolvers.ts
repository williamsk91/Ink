import bcrypt from "bcrypt";
import { IResolverMap } from "./types/graphql-utils";
import { User } from "./entity/User";

export const resolvers: IResolverMap = {
  Query: {
    hello: (_, { name }: GQL.IHelloOnQueryArguments) =>
      `Hello ${name || "World"}`
  },
  Mutation: {
    register: async (
      _,
      { email, password }: GQL.IRegisterOnMutationArguments
    ) => {
      const hashedPass = await bcrypt.hash(password, 10);

      const user = User.create({
        email,
        password: hashedPass
      });

      await user.save();

      return true;
    }
  }
};
