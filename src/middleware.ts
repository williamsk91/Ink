import { IResolver } from "./types/graphql-utils";

export default async (
  resolver: IResolver,
  parent: any,
  args: any,
  context: any,
  info: any
) => {
  // user is not logged in
  if (!context.session || !context.session.userId) {
    return null;
  }

  const result = await resolver(parent, args, context, info);

  // afterware

  return result;
};
