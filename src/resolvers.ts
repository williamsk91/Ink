import { IResolverMap } from "./types/graphql-utils";

export const resolvers: IResolverMap = {
  Query: {
    hello: () => "world!"
  }
};
