"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const schema_1 = require("@graphql-tools/schema");
const auth_middleware_1 = __importDefault(require("./middleware/auth.middleware"));
const index_1 = require("./graphql/schema/index");
const index_2 = __importDefault(require("./graphql/resolvers/index"));
const mongoose_1 = require("./helpers/mongoose");
// import AuthDirective from "./src/graphql/directives/roleDirective";
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const schema = (0, schema_1.makeExecutableSchema)({
    typeDefs: index_1.typedDefs,
    resolvers: index_2.default,
    //   schemaExtensions: {
    // auth: AuthDirective,
    //   },
});
const server = new server_1.ApolloServer({
    schema,
    plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    formatError: (error) => {
        var _a;
        return {
            message: error.message,
            code: (_a = error.extensions) === null || _a === void 0 ? void 0 : _a.code,
            locations: error.locations,
            path: error.path,
        };
    },
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.start();
        yield mongoose_1.DB;
        app.use((0, cors_1.default)(), express_1.default.json(), (0, express4_1.expressMiddleware)({ app, server, context: auth_middleware_1.default }));
        console.log("## DB connected");
        yield new Promise((resolve) => httpServer.listen({ port: process.env.PORT }, resolve()));
        console.log(`🚀 Server ready at http://localhost:${process.env.PORT}/`);
    }
    catch (error) {
        console.error("## ERROR : ", error);
    }
}))();
