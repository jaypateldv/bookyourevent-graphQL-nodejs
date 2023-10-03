import {
  GraphQLSchema,
  GraphQLFieldConfig,
  GraphQLResolveInfo,
  defaultFieldResolver,
} from "graphql";
import { mapSchema, getDirective, MapperKind } from "@graphql-tools/utils";
import { UserDocument } from "../../models/user";
import { getFilePreSignedUrl } from "../../helpers/aws.service";
interface Context {
  loggedUser: UserDocument | null;
  req: Request;
}

function GetPresignedUrlDirective(
  schema: GraphQLSchema,
  directiveName: string
) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (
      fieldConfig: GraphQLFieldConfig<any, Context, any>
    ) => {
      const getPresignedUrlDirective = getDirective(
        schema,
        fieldConfig,
        directiveName
      )?.[0];
      if (getPresignedUrlDirective) {
        const { resolve = defaultFieldResolver } = fieldConfig;
        fieldConfig.resolve = async function (
          source: any,
          args: Record<string, any>,
          context: Context,
          info: GraphQLResolveInfo
        ) {
          const { loggedUser, req } = context;
          if (source.profileKey) {
            return getFilePreSignedUrl(source.profileKey);
          }
          return resolve(source, args, context, info);
        };
        return fieldConfig;
      }
    },
  });
}

export default GetPresignedUrlDirective;
