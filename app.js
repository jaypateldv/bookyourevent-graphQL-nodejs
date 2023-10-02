const express = require("express");
const http = require('http');
const cors = require('cors');
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { typedDefs } = require("./graphql/schema/index");
const auth = require("./middleware/auth.middleware");
const graphQlResolver = require("./graphql/resolvers/index");
const DB = require("./helpers/mongoose");
const HasRoleDirective = require("./graphql/directives/roleDirective");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const AuthDirective = require("./graphql/directives/roleDirective");

const app = express();
const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
    typeDefs: typedDefs,
    resolvers: graphQlResolver,
    schemaExtensions: {
        auth: AuthDirective
    }
});
const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    formatError: (error) => {
        return {
            message: error.message,
            code: error.extensions.code,
            locations: error.locations,
            path: error.path,
        };
    },
});

(async () => {
    try {
        await server.start();
        await DB;
        app.use(cors(), express.json(), expressMiddleware(server, {
            context: auth
        }));
        console.log("## DB connected");
        await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
    } catch (error) {
        console.error("## ERROR : ", error);
    }

})();