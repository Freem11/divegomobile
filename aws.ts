import {
  S3Client,
} from "@aws-sdk/client-s3";

import { awsAccessKeyId, awsAccountId, awsSecretKey } from "./compnents/globalVariables";

export const aws3 = new S3Client({
  region: "auto",
  endpoint: `https://${awsAccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId : awsAccessKeyId,
    secretAccessKey: awsSecretKey
  }
});
