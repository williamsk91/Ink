import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";
import { resolvers } from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers
});

createConnection().then(connection => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
