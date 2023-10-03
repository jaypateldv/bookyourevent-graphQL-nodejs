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
