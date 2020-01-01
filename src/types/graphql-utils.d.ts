import { Request } from "express";

export type IResolver = (
  parent: any,
  args: any,
  context: {
    url: string;
  },
  info: any
) => any;

export type IGraphQLMiddleware = (
  resolver: IResolver,
  parent: any,
  args: any,
  context: {
    url: string;
  },
  info: any
) => any;

export interface IResolverMap {
  [key: string]: {
    [key: string]: IResolver;
  };
}
