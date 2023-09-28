const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { default: mongoose, Query } = require("mongoose");
const cors = require('cors');
const { typedDefs } = require("./graphql/schema/index");
const graphQlResolver = require("./graphql/resolvers/index");
const auth = require("./middleware/auth.middleware");
const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require('@apollo/server/standalone');
// const { ApolloServerPluginDrainHttpServer } = require('apollo-server-plugin-drain-http-server');
const bodyParser = require('body-parser');
const { expressMiddleware } = require('@apollo/server/express4');

// const { typeDefs, resolvers } = require('./schema');
// server using express graphql ====================================================

const app = express();
app.use(cors(), express.json());
app.post('/auth/login', async (req, res, next) => {
    try {
        res.status(200).send('Welcome to event booking');

    } catch (error) {

    }
});
app.post('auth/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log("=== Login Start");
        const user = await User.findUserByCredential(email, password);
        const token = jwt.sign({ userId: user._id, email }, process.env.JWT_SECRETE, { expiresIn: "1h" });
        // return {
        //     token,
        //     ...user._doc,
        //     createdEvents: events.bind(this, user.createdEvents),
        // };
        res.status(200).send({
            token,
            ...user._doc,
            createdEvents: events.bind(this, user.createdEvents),
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('error');
        throw err;
    }
});
const server = new ApolloServer({
    typeDefs: typedDefs,
    resolvers: graphQlResolver,
});
(async () => {
    await server.start();
    app.use('/graphql', expressMiddleware(server, {
        context: auth
    }));
})();

// app.use(auth);
// app.get('/', (req, res, next) => {
//     res.status(200).send('Welcome to normal request');
// });
// app.use("/graphql", graphqlHTTP({
//     schema: graphQlSchema,
//     rootValue: graphQlResolver,
//     graphiql: true,
//     customFormatErrorFn: (err) => {
//         return { message: err.message, status: err.extensions.code || 500 };
//     }
// }));

// server using apollo  ====================================================

mongoose.connect(process.env.MONGO_URL).then(async () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server runnig on port ${process.env.PORT}`);
    });
    // const { url } = await startStandaloneServer(server, {
    //     listen: { port: 3000 },
    //     context: auth
    // });
}).catch((error) => {
    console.log(error);
});
