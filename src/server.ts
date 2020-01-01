import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";

import { resolvers } from "./resolvers";

/**
 * GraphQL server
 */
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: ({ request }) => ({
    url: request.protocol + "://" + request.get("host")
  })
});

const cors = {
  origin: [process.env.FRONTEND_HOST as string, "https://app.kaminote.io"]
};

createConnection().then(async _connection => {
  server.start({ cors, port: process.env.PORT || 4000 }, ({ port }) => {
    console.log(`Server is running on localhost:${port}`);
  });
});
