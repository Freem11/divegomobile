
const resetPasswordURL = "scubaseasons://account/password";

const prodCloudflareBucketUrl = "https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/";
const devCloudflareBucketUrl = "https://pub-2c7837e6ce9144f5bba12fc08174562f.r2.dev/";

const prodAwsAccountId = process.env.EXPO_PUBLIC_AWS_R2_ACCOUNT_ID || process.env.AWS_R2_ACCOUNT_ID;
const prodAwsAccessKeyId = process.env.EXPO_PUBLIC_AWS_R2_ACCESS_KEY_ID || process.env.AWS_R2_ACCESS_KEY_ID;
const prodAwsSecretKey = process.env.EXPO_PUBLIC_AWS_R2_SECRET_KEY || process.env.AWS_R2_SECRET_KEY;

const devAwsAccountId = process.env.EXPO_PUBLIC_AWS_R2_DEV_ACCOUNT_ID;
const devAwsAccessKeyId = process.env.EXPO_PUBLIC_AWS_R2_DEV_ACCESS_KEY_ID;
const devAwsSecretKey = process.env.EXPO_PUBLIC_AWS_R2_DEV_SECRET_KEY;

let awsAccessKeyId = devAwsAccessKeyId;
let awsSecretKey = devAwsSecretKey;
let awsAccountId = devAwsAccountId;
let cloudflareBucketUrl = devCloudflareBucketUrl;

// const useProdKeys = false;
const useProdKeys = true;

if (useProdKeys) {
  awsAccessKeyId = prodAwsAccessKeyId;
  awsSecretKey = prodAwsSecretKey;
  awsAccountId = prodAwsAccountId;
  cloudflareBucketUrl = prodCloudflareBucketUrl;
};

// console.log(cloudflareBucketUrl, awsAccessKeyId, awsSecretKey, awsAccountId);

export { cloudflareBucketUrl, awsAccessKeyId, awsSecretKey, awsAccountId, resetPasswordURL };