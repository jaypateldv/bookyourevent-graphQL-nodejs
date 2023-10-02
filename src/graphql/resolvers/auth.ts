import { Document } from "mongoose";
import * as jwt from "jsonwebtoken";
import { events } from "./merge";
import { User } from "../../models/user";
import { CustomError } from "../../helpers/customError";
interface ContextValue {
  loggedUser?: Document;
  req: any;
}

interface CreateUserArgs {
  userInput: {
    email: string;
    password: string;
  };
}

interface LoginArgs {
  email: string;
  password: string;
}

async function users(args: any, value: any, contextValue: ContextValue) {
  try {
    const { loggedUser, req } = contextValue;
    console.log("=== Users started", req.isAuth);
    if (!req.isAuth) throw new CustomError("Unauthorized User", 401);
    const user: any = await User.findById(req.authUser).populate(
      "createdEvents"
    );
    return {
      ...user?._doc,
      password: null,
    };
  } catch (error) {
    throw error;
  }
}

const login = async (args: any, { email, password }: LoginArgs) => {
  try {
    console.log("=== Login Start");
    const user: any = await User.findUserByCredential(email, password);
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRETE!,
      { expiresIn: "1h" }
    );
    return {
      token,
      ...user?._doc,
      createdEvents: events.bind(this, user?.createdEvents),
    };
  } catch (err) {
    console.error(err);
    throw err;
  }
};

async function createUser(args: any, { userInput }: CreateUserArgs) {
  try {
    console.log("=== Create user start", userInput);
    const existUser = await User.findOne({ email: userInput.email });
    if (existUser) throw new CustomError("Email already exists", 400);
    const user = new User({
      email: userInput.email,
      password: userInput.password,
    });
    const userData: any = await user.save();
    return { ...userData?._doc, password: null };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export { users, login, createUser };
