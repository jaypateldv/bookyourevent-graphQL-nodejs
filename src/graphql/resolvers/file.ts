import { FileUpload } from "graphql-upload/Upload.mjs";
import { uploadProfilePhotoToS3 } from "../../helpers/aws.service";
import { CustomError } from "../../helpers/customError";
import { User, UserDocument } from "../../models/user";
interface ContextValue {
  loggedUser?: UserDocument;
  req: any;
}
async function uploadProfilePhoto(
  args: any,
  { file }: { file: Promise<FileUpload> },
  contextValue: ContextValue
) {
  try {
    const { loggedUser, req } = contextValue;
    if (!req.isAuth) throw new CustomError("Unauthorised user", 401);
    const uploadedFile = await file;
    if (!uploadedFile) {
      throw new Error("No file provided.");
    }
    let m = await uploadProfilePhotoToS3(uploadedFile, loggedUser?._id);
    await User.findByIdAndUpdate(loggedUser?._id, { profileKey: m.Key });
    return {
      profileKey: m.Key,
    };
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw new CustomError("Failed to upload profile photo.", 500);
  }
}
export { uploadProfilePhoto };
