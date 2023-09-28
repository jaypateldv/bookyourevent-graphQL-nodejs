const { GraphQLError } = require("graphql");

class CustomError extends GraphQLError {
    constructor(message, code) {
        super(message, { extensions: { code, http: { status: code } } });
    }
}
module.exports = CustomError;