const { SchemaDirectiveVisitor } = require('@apollo/server');
class HasRoleDirective extends SchemaDirectiveVisitor {
    visitFieldDefinition(field) {
        const { resolve = defaultFieldResolver } = field;
        const { role } = this.args;

        field.resolve = async function (...args) {
            const context = args[2];
            const user = context.user; // Assuming you have a user object in the context

            if (!user || !user.roles || !user.roles.includes(role)) {
                throw new Error(`You don't have the necessary role: ${role}`);
            }

            return resolve.apply(this, args);
        };
    }
}
module.exports = HasRoleDirective;