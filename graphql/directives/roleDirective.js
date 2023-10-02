// const { schema } = require('@graphql-tools/schema');
// const { makeExecutableSchema, SchemaDirectiveVisitor } = require('@graphql-tools/utils');

// class AuthDirective extends getDirectiveInExtensions {
//     visitFieldDefinition(field) {
//         console.log(" ### AuthDirective");
//         const { resolve = defaultFieldResolver } = field;
//         const { roles } = this.args;

//         field.resolve = async function (source, args, context, info) {
//             // Check if the user has the required roles
//             const userRoles = context.userRoles || [];
//             if (!userRoles.some(role => roles.includes(role))) {
//                 throw new Error('Access denied');
//             }

//             return resolve.call(this, source, args, context, info);
//         };
//     }
// }
// module.exports = AuthDirective;