// tslint:disable
// graphql typescript definitions

declare namespace GQL {
interface IGraphQLResponseRoot {
data?: IQuery | IMutation;
errors?: Array<IGraphQLResponseError>;
}

interface IGraphQLResponseError {
/** Required for all errors */
message: string;
locations?: Array<IGraphQLResponseErrorLocation>;
/** 7.2.2 says 'GraphQL servers may provide additional entries to error' */
[propName: string]: any;
}

interface IGraphQLResponseErrorLocation {
line: number;
column: number;
}

interface IQuery {
__typename: "Query";
getPage: IPage | null;
getUserPages: Array<IPage>;
me: IUser | null;
}

interface IGetPageOnQueryArguments {
id: string;
}

interface IPage {
__typename: "Page";
id: string;
title: string;
path: Array<string>;
content: string;
}

interface IUser {
__typename: "User";
id: string;
email: string;
displayName: string | null;
}

interface IMutation {
__typename: "Mutation";
createPage: IPage;
deletePage: string;
savePageTitle: string;
saveContent: string;
invalidateTokens: boolean;
}

interface ICreatePageOnMutationArguments {
path: Array<string>;
}

interface IDeletePageOnMutationArguments {
pageId: string;
}

interface ISavePageTitleOnMutationArguments {
pageId: string;
title: string;
}

interface ISaveContentOnMutationArguments {
pageId: string;
content: string;
}

interface IPageTitle {
__typename: "PageTitle";
id: string;
title: string;
}
}

// tslint:enable
