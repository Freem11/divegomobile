import {
  S3Client,
} from "@aws-sdk/client-s3";

let awsAccessKeyId = process.env.EXPO_PUBLIC_AWS_R2_DEV_ACCESS_KEY_ID || process.env.AWS_R2_ACCESS_KEY_ID;
let awsSecretKey = process.env.EXPO_PUBLIC_AWS_R2_DEV_SECRET_KEY || process.env.AWS_R2_SECRET_KEY;
let awsAccountId = process.env.EXPO_PUBLIC_AWS_R2_DEV_ACCOUNT_ID || process.env.AWS_R2_ACCOUNT_ID;

const useProdKeys = false;
// const useProdKeys = true;

if (useProdKeys){
  awsAccessKeyId = process.env.EXPO_PUBLIC_AWS_R2_ACCESS_KEY_ID;
  awsSecretKey = process.env.EXPO_PUBLIC_AWS_R2_SECRET_KEY;
  awsAccountId = process.env.EXPO_PUBLIC_AWS_R2_ACCOUNT_ID;
};

export const aws3 = new S3Client({
  region: "auto",
  endpoint: `https://${awsAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId : awsAccessKeyId,
    secretAccessKey: awsSecretKey
  }
});
