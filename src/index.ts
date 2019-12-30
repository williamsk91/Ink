import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";

import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

import { resolvers } from "./resolvers";

const redis = new Redis();
const RedisStore = connectRedis(session);

/**
 * GraphQL server
 */
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: ({ request }) => ({
    redis,
    url: request.protocol + "://" + request.get("host"),
    req: request.session
  })
});

/**
 * Session
 */
server.express.use(
  session({
    store: new RedisStore({ client: redis }),
    name: "qid",
    secret: "weeeee_secrets~~",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 //7days
    }
  })
);

const cors = {
  origin: [process.env.FRONTEND_HOST as string]
};

createConnection().then(async connection => {
  server.start({ cors, port: 4000 }, ({ port }) => {
    console.log(`Server is running on localhost:${port}`);
  });
});
