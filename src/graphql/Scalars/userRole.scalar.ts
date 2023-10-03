import { GraphQLScalarType, Kind } from "graphql";
import { CustomError } from "../../helpers/customError";
const allowedRoles = ["Admin", "User", "Manager", "Guest"];
const userRole = (value) => {
  if (typeof value === "string" && allowedRoles.includes(value)) return value;
  else throw new CustomError("Invalid UserRole Type", 400);
};
export const UserRole = new GraphQLScalarType({
  name: "UserRole",
  description: "User role can be Admin, User, Manager and Guest",
  serialize: userRole,
  parseValue: userRole,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return userRole(ast.value);
    }
    return null;
  },
});
