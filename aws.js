import {
  S3Client,
} from "@aws-sdk/client-s3";
import config from './config';

const awsAccountId = config.AWS_R2_ACCOUNT_ID
const awsAccessKeyId = config.AWS_R2_ACCESS_KEY_ID
const awsSecretKey = config.AWS_R2_SECRET_KEY

export const aws3 = new S3Client({
    region: "auto",
    endpoint: `https://${awsAccountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId : awsAccessKeyId,
        secretAccessKey: awsSecretKey
    }
})
