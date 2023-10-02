import express from "express";
import * as http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { auth } from "./middleware/auth.middleware";
import { typedDefs } from "./graphql/schema/index";
import { resolver as graphQlResolver } from "./graphql/resolvers/index";
import { DB } from "./helpers/mongoose";
// import AuthDirective from "./src/graphql/directives/roleDirective";

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
  typeDefs: typedDefs,
  resolvers: graphQlResolver,
  //   schemaExtensions: {
  // auth: AuthDirective,
  //   },
});

const server = new ApolloServer({
  schema,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError: (error) => {
    return {
      message: error.message,
      code: error.extensions?.code,
      locations: error.locations,
      path: error.path,
    };
  },
});

(async () => {
  try {
    await server.start();
    await DB;
    app.use(
      cors(),
      express.json(),
      expressMiddleware(server, { context: auth })
    );
    console.log("## DB connected");
    // await new Promise((resolve) =>
    //   httpServer.listen({ port: process.env.PORT }, resolve())
    // );
    httpServer.listen({ port: process.env.PORT }, () => {
      console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
    });
  } catch (error) {
    console.error("## ERROR : ", error);
  }
})();
