import { GraphQLError } from "graphql";
export class CustomError extends GraphQLError {
  constructor(message: string, code: number) {
    super(message, { extensions: { code, http: { status: code } } });
  }
}
