const express = require("express");
const http = require('http');
const cors = require('cors');
const { default: mongoose } = require("mongoose");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require('@apollo/server/express4');
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer');
const { typedDefs } = require("./graphql/schema/index");
const auth = require("./middleware/auth.middleware");
const graphQlResolver = require("./graphql/resolvers/index");
const HasRoleDirective = require("./graphql/directives/roleDirective");

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
    typeDefs: typedDefs,
    resolvers: graphQlResolver,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    schemaDirectives: {
        hasRole: HasRoleDirective,
    },
});

(async () => {
    await server.start();

    app.use(cors(), express.json(), expressMiddleware(server, {
        context: auth
    }));

    mongoose.connect(process.env.MONGO_URL).then(async () => {
        console.log("## DB connected");
        await new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve));
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
    });

})();