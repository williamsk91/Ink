import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from "apollo-server-errors";
import { PageAccess, PageToUser } from "./entity/PageToUser";

import { IResolverMap } from "./types/graphql-utils";
import { Page } from "./entity/Page";
import { State } from "./entity/State";
import { User } from "./entity/User";
import { getConnection } from "typeorm";

export const resolvers: IResolverMap = {
  Query: {
    me: async (_parent, _args, { req }) => {
      if (!req.userId) throw new AuthenticationError("user is not signed in");
      return User.findOne(req.userId);
    },
    getPage: async (_parent, { id }: GQL.IGetPageOnQueryArguments, { req }) => {
      // find page by id
      const page = await getConnection()
        .getRepository(Page)
        .createQueryBuilder("page")
        // `State`
        .leftJoinAndSelect("page.state", "state")
        // `User` through `PageToUser`
        .leftJoinAndSelect("page.pageToUser", "pageToUser")
        .leftJoinAndSelect("pageToUser.user", "user")
        .where("page.id = :id", { id })
        .getOne();

      if (!page || page.deleted)
        throw new UserInputError("page does not exist");

      // check `User`'s `PageAccess`
      if (!req.userId) throw new AuthenticationError("user is not signed in");
      const pageToUser = page.pageToUser.find(({ user, access }) => {
        return req.userId === user.id && access === PageAccess.Creator;
      });

      // user can access this page
      if (!pageToUser) throw new ForbiddenError("user has no access to page");

      const { title, path } = page;
      return {
        id,
        title,
        path,
        content: page.state.content
      };
    },
    getUserPages: async (_parent, _args, { req }) => {
      const userId = req.userId;
      if (!req.userId) throw new AuthenticationError("user is not signed in");

      const pageToUsers = await getConnection()
        .getRepository(PageToUser)
        .createQueryBuilder("pageToUser")
        .leftJoinAndSelect("pageToUser.page", "page")
        .leftJoinAndSelect("pageToUser.user", "user")
        .where("user.id = :userId", { userId })
        .andWhere("page.deleted = FALSE")
        .getMany();

      const pages = pageToUsers.map(({ page }) => ({
        id: page.id,
        title: page.title ? page.title : ""
      }));

      return pages;
    }
  },
  Mutation: {
    createPage: async (
      _,
      { path }: GQL.ICreatePageOnMutationArguments,
      { req }
    ) => {
      // ensure user is logged in
      if (!req.userId) throw new AuthenticationError("user is not signed in ");

      const user = await User.findOne(req.userId);

      // TODO: change this error type
      if (!user) throw new AuthenticationError("user is not found ");

      const savedState = await createBasePage(user, path);

      const { content } = savedState;
      const { id, title } = savedState.page;
      return {
        id,
        title,
        path,
        content
      };
    },
    deletePage: async (
      _,
      { pageId }: GQL.IDeletePageOnMutationArguments,
      { req }
    ) => {
      // ensure user is logged in
      if (!req.userId) throw new AuthenticationError("user is not signed in ");

      const page = await Page.findOne(pageId);
      if (!page) throw new UserInputError("page does not exist");

      page.deleted = true;
      await page.save();

      return pageId;
    },
    savePageTitle: async (
      _parent,
      { pageId, title }: GQL.ISavePageTitleOnMutationArguments,
      { req }
    ) => {
      // verify user
      if (!req.userId) throw new AuthenticationError("user is not signed in ");

      // find page
      const page = await Page.findOne(pageId);
      if (!page) throw new UserInputError("page does not exist");

      // update title
      page.title = title;
      await page.save();

      return title;
    },
    saveContent: async (
      _parent,
      { pageId, content }: GQL.ISaveContentOnMutationArguments,
      { req }
    ) => {
      // find page
      const page = await Page.findOne(pageId);
      if (!page) throw new UserInputError("page does not exist");

      // verify user
      if (!req.userId) throw new AuthenticationError("user is not signed in ");

      // save content as new state
      const newState = State.create({
        content,
        page
      });
      const savedState = await newState.save();

      return savedState.id;
    },
    invalidateTokens: async (_, __, { req, res }) => {
      if (!req.userId) return false;

      // updates count
      const user = await User.findOne(req.userId);
      if (!user) return false;
      user.count += 1;
      await user.save();

      // clear cookies
      res.clearCookie("refresh-token");
      res.clearCookie("access-token");

      return true;
    }
  }
};

// ------------------------- Helpers -------------------------

export const createBasePage = async (user: User, path: string[]) => {
  /**
   * PageToUser
   */
  const pageToUser = PageToUser.create({
    user,
    access: PageAccess.Creator
  });

  /**
   * `Page`
   */
  const page = Page.create({
    path,
    title: "",
    // connect user
    pageToUser: [pageToUser]
  });

  /**
   * `State`
   */
  const startingContent = "";
  const newState = State.create({
    content: startingContent,
    // connect state and page
    page
  });

  /**
   * Saving
   */
  const savedState = await newState.save();

  return savedState;
};
