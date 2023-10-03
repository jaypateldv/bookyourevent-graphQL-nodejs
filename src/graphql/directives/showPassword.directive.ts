import {
  GraphQLSchema,
  GraphQLFieldConfig,
  GraphQLResolveInfo,
  defaultFieldResolver,
} from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { UserDocument } from "../../models/user";
interface Context {
  loggedUser: UserDocument | null;
  req: Request;
}

function ShowPasswordDirective(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<any, Context, any>
    ) => {
      const showPasswordDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (showPasswordDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: any,
          args: Record<string, any>,
          context: Context,
          info: GraphQLResolveInfo
        ) {
          const { loggedUser, req } = context;
          console.log("ShowPasswordDirective");

          if (!showPasswordDirective.requiredRoles.includes(loggedUser?.role)) {
            return null;
          } else {
            return "You can see this field as you have required role !!";
          }
          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}

export default ShowPasswordDirective;
