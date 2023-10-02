import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { Document } from "mongoose"; // Assuming 'user' model returns a Mongoose Document
import { User } from "../models/user";
interface AuthMiddlewareParams {
  req: any;
}
export const auth = async ({
  req,
}: AuthMiddlewareParams): Promise<{ loggedUser?: Document; req: Request }> => {
  try {
    console.log(
      "=== Middleware started:",
      new Date().toLocaleString(),
      req.headers["authorization"]
    );
    const token = req.headers["authorization"] as string;

    if (!token || token === "") {
      req["isAuth"] = false;
      console.log("=== User unauthorized 1");
      return { req };
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRETE!
    ) as jwt.JwtPayload;
    const loggedUser = await User.findById(decodedToken.userId);

    if (loggedUser) {
      req.authUser = decodedToken.userId;
      req.isAuth = true;
      console.log("=== User authorized");
      return { loggedUser, req };
    } else {
      req.isAuth = false;
      console.log("=== User unauthorized 2");
      return { req };
    }
  } catch (error) {
    console.error(error);
    console.log("=== User unauthorized");
    req.isAuth = false;
    return { req };
  }
};
