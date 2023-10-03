import * as AWS from "aws-sdk";

export const awsConfig = {
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  region: process.env.region,
  bucketName: process.env.bucketName,
};

AWS.config.update(awsConfig);

const S3 = new AWS.S3();

export function getFilePreSignedUrl(Key: string) {
  const params = {
    Bucket: awsConfig.bucketName,
    Key,
  };
  return S3.getSignedUrl("getObject", params);
}

export async function uploadProfilePhotoToS3(file: any, key: string) {
  const { createReadStream, filename, mimetype } = file.file;
  const fileParts = filename.split(".");
  const stream = createReadStream();
  const params = {
    Bucket: awsConfig.bucketName!,
    Key: `profilePhoto/${key}-${filename}`,
    Body: stream,
    ContentType: fileParts[fileParts.length - 1],
  };
  return S3.upload(params).promise();
}
