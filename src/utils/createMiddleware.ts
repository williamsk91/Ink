import { IGraphQLMiddleware, IResolver } from "../types/graphql-utils";

export const createMiddleware = (
  middleware: IGraphQLMiddleware,
  resolver: IResolver
) => (parent: any, args: any, context: any, info: any) =>
  middleware(resolver, parent, args, context, info);
