import {
  S3Client,
} from "@aws-sdk/client-s3";

const awsAccountId = process.env.EXPO_PUBLIC_AWS_R2_ACCOUNT_ID
const awsAccessKeyId = process.env.EXPO_PUBLIC_AWS_R2_ACCESS_KEY_ID
const awsSecretKey = process.env.EXPO_PUBLIC_AWS_R2_SECRET_KEY

export const aws3 = new S3Client({
  region: "auto",
  endpoint: `https://${awsAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId : awsAccessKeyId,
    secretAccessKey: awsSecretKey
  }
})
