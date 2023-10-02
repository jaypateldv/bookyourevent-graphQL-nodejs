import {
  GraphQLSchema,
  GraphQLFieldConfig,
  GraphQLResolveInfo,
  defaultFieldResolver,
  GraphQLError,
} from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { UserDocument } from "../../models/user";
interface Context {
  loggedUser: UserDocument | null;
  req: Request;
}

interface User {
  // Define user properties
  // Example: id, username, etc.
}

function AuthenticationDirective(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<any, Context, any>
    ) => {
      const authenticatedDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (authenticatedDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: any,
          args: Record<string, any>,
          context: Context,
          info: GraphQLResolveInfo
        ) {
          const { loggedUser, req } = context;
          if (!loggedUser) {
            throw new GraphQLError("Unauthorized Access!", {
              extensions: {
                code: "UNAUTHENTICATED",
              },
            });
          }
          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}

export default AuthenticationDirective;
