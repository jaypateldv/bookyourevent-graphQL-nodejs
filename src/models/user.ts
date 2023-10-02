import mongoose, { Document, Schema, Model } from "mongoose";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { CustomError } from "../helpers/customError";

enum roleType {
  Admin,
  User,
}
export interface UserDocument extends Document {
  email: string;
  password: string;
  role: String;
  createdEvents: Schema.Types.ObjectId[];
}

interface UserModel extends Model<UserDocument> {
  findUserByCredential(email: string, password: string): Promise<UserDocument>;
}

const userSchema = new Schema<UserDocument, UserModel>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
  role: {
    type: String,
    enum: roleType,
    required: true,
  },
});

userSchema.statics.findUserByCredential = async function (
  email: string,
  password: string
): Promise<UserDocument> {
  const user = await this.findOne({ email });
  if (!user) throw new CustomError("Invalid email or password", 400);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new CustomError("Invalid email or password", 400);

  return user;
};

userSchema.methods.generateAuthToken = async function (): Promise<string> {
  const user: any = this as UserDocument;
  const token = await jwt.sign(
    { _id: user._id.toString() },
    "thisismysecretforkwttoken"
  );
  // Assuming you have a 'tokens' field in your schema
  user["tokens"] = user.tokens.concat({ token });
  await user.save();
  return token;
};

// userSchema.methods.toJSON = function (): Record<string, unknown> {
//   const user = this as UserDocument;
//   const userObject = user.toObject();

//   delete userObject.password;

//   return userObject;
// };

userSchema.pre("save", async function (next) {
  const user = this as UserDocument;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };
