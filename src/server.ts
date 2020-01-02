import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";

import { resolvers } from "./resolvers";
import { useGoogleOauth } from "./authentication/google";
import { IContext } from "./types/graphql-utils";
import cookieParser = require("cookie-parser");
import { JWTMiddleware } from "./authentication/JWT";

const start = async () => {
  /**
   * GraphQL server
   */
  const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql",
    resolvers,
    context: ({ request, response }): IContext => ({
      url: request.protocol + "://" + request.get("host"),
      req: request,
      res: response
    })
  });

  await createConnection();

  server.express.use(cookieParser());
  server.express.use(JWTMiddleware());

  /**
   * Oauth
   *
   * note: has to be under the above `await createConnection()`
   */
  useGoogleOauth(server);

  /**
   * Cors
   */
  const cors = {
    origin: [process.env.FRONTEND_HOST as string, "https://app.kaminote.io"],
    credentials: true
  };

  server.start({ cors, port: process.env.PORT || 4000 }, ({ port }) => {
    console.log(`🚀  Server is running on localhost:${port}`);
  });
};

start();
