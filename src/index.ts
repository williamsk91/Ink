import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";

import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";

import { resolvers } from "./resolvers";
import { User } from "./entity/User";

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
  credential: true,
  origin: process.env.FRONTEND_HOST as string
};

/**
 * Confirm email
 */
server.express.get("/confirm/:id", async (req, res) => {
  const { id } = req.params;
  const userId = await redis.get(id);

  if (userId) {
    await User.update({ id: userId }, { confirmed: true });
    res.send("ok");
  } else {
    res.send("invalid");
  }
});

createConnection().then(async connection => {
  server.start({ cors, port: 4000 });
  console.log("Server is running on localhost:4000");
});
