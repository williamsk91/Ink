import { Redis } from "ioredis";
import { Request } from "express";

export interface ISession extends Express.Session {
  userId?: string;
}

export type IResolver = (
  parent: any,
  args: any,
  context: {
    redis: Redis;
    url: string;
    session: ISession;
  },
  info: any
) => any;

export type IGraphQLMiddleware = (
  resolver: IResolver,
  parent: any,
  args: any,
  context: {
    redis: Redis;
    url: string;
    session: ISession;
  },
  info: any
) => any;

export interface IResolverMap {
  [key: string]: {
    [key: string]: IResolver;
  };
}
