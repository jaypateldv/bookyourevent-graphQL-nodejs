import {
  GraphQLSchema,
  GraphQLFieldConfig,
  GraphQLResolveInfo,
  defaultFieldResolver,
} from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { UserDocument } from "../../models/user";
import { CustomError } from "../../helpers/customError";
interface Context {
  loggedUser: UserDocument | null;
  req: Request;
}

interface User {
  // Define user properties
  // Example: id, username, etc.
}

function RoleAuthenticationDirective(
  schema: GraphQLSchema,
  directiveName: string
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<any, Context, any>
    ) => {
      const roleAuthenticatedDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (roleAuthenticatedDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: any,
          args: Record<string, any>,
          context: Context,
          info: GraphQLResolveInfo
        ) {
          const { loggedUser, req } = context;
          if (!roleAuthenticatedDirective.roles.includes(loggedUser?.role))
            throw new CustomError(
              `Missing required role ${roleAuthenticatedDirective.roles.join(
                ","
              )}`,
              401
            );
          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}

export default RoleAuthenticationDirective;
