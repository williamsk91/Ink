import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from "apollo-server-errors";

const notSignedIn = new AuthenticationError("user is not signed in");

const noUserFound = new AuthenticationError("user does not exist");

const noPageAccess = new ForbiddenError("user has no access to page");

const noPageFound = new UserInputError("page does not exist");

export const errors = { notSignedIn, noUserFound, noPageAccess, noPageFound };
