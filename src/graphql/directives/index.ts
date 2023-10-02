import { makeExecutableSchema } from "@graphql-tools/schema";
import { typedDefs } from "../schema";
import AuthenticationDirective from "./auth.directive";
import { resolver as graphQlResolver } from "../resolvers/index";
import { GraphQLSchema } from "graphql";
import RoleAuthenticationDirective from "./roleAuth.directive";
import ShowPasswordDirective from "./showPassword.directive";

const directiveTransformers = [
  { directive: AuthenticationDirective, directiveName: "authenticated" },
  { directive: RoleAuthenticationDirective, directiveName: "requiredRole" },
  { directive: ShowPasswordDirective, directiveName: "showPassword" },
];
const baseSchema: GraphQLSchema = directiveTransformers.reduce(
  (schema, { directive, directiveName }) => directive(schema, directiveName),
  makeExecutableSchema({
    typeDefs: [typedDefs],
    resolvers: graphQlResolver,
  })
);

export { baseSchema };
