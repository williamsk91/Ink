import "reflect-metadata";
import { createConnection } from "typeorm";
import { GraphQLServer } from "graphql-yoga";
import Redis from "ioredis";
import { resolvers } from "./resolvers";
import { User } from "./entity/User";

const redis = new Redis();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: ({ request }) => ({
    redis,
    url: request.protocol + "://" + request.get("host")
  })
});

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

createConnection().then(connection => {
  server.start(() => console.log("Server is running on localhost:4000"));
});
