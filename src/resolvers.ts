import { IResolverMap } from "./types/graphql-utils";
import { Page } from "./entity/Page";
import { State } from "./entity/State";

export const resolvers: IResolverMap = {
  Query: {
    getPage: async (_parent, { id }: GQL.IGetPageOnQueryArguments) => {
      // find by id
      const page = await Page.findOne({ where: { id }, relations: ["state"] });

      // return null if not found
      if (!page) return null;

      const { title, path } = page;
      return {
        id,
        title,
        path,
        content: page.state.content
      };
    }
  },
  Mutation: {
    createPage: async (_, { path }: GQL.ICreatePageOnMutationArguments) => {
      const startingContent = "";

      const newPage = Page.create({ path });

      const newState = State.create({
        content: startingContent,
        // connect state and page
        page: newPage
      });

      const savedState = await newState.save();

      const { id, title } = savedState.page;
      return {
        id,
        title,
        path,
        content: startingContent
      };
    },
    saveContent: async (
      _parent,
      { pageId, content }: GQL.ISaveContentOnMutationArguments
    ) => {
      // find page
      const page = await Page.findOne(pageId);
      if (!page) return null;

      // save content as new state
      const newState = State.create({
        content,
        page
      });
      const savedState = await newState.save();

      return savedState.id;
    }
  }
};
