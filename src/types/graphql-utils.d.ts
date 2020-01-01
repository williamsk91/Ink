import { Request, Response } from "express";

export interface IContext {
  url: string;
  req: Request;
  res: Response;
}

export type IResolver = (
  parent: any,
  args: any,
  context: IContext,
  info: any
) => any;

export interface IResolverMap {
  [key: string]: {
    [key: string]: IResolver;
  };
}
