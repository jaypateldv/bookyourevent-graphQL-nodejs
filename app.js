const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { default: mongoose } = require("mongoose");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolver = require("./graphql/resolvers/index");
const auth = require("./middleware/auth");
const app = express();


app.use(express.json());
// app.use(auth);
app.use("/graphql", graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolver,
    graphiql: true
})
);

mongoose.connect(process.env.MONGO_URL).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server runnig on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
});
