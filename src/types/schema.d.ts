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
hello: string | null;
getPage: IPage | null;
}

interface IGetPageOnQueryArguments {
id: string;
}

interface IPage {
__typename: "Page";
id: string | null;
title: string | null;
path: Array<string | null> | null;
content: string | null;
}

interface IMutation {
__typename: "Mutation";
createPage: IPage | null;
saveContent: string | null;
}

interface ICreatePageOnMutationArguments {
path: Array<string>;
}

interface ISaveContentOnMutationArguments {
pageId: string;
content: string;
}
}

// tslint:enable
