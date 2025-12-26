import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { aws3 } from "../../aws";

import "react-native-get-random-values";
import "react-native-url-polyfill/auto";
import { ReadableStream } from "web-streams-polyfill/ponyfill";

import { Buffer } from "buffer";

import { showError } from "../toast";

globalThis.ReadableStream = ReadableStream;

export const uploadphoto = async (file, fileName) => {
  try {
    const fileBuffer = Buffer.from(file, "base64");
    const fileSize = fileBuffer.length;

    const input = {
      "Body": fileBuffer,
      "Bucket": "scubaseasons",
      "Key": fileName,
      "ContentType": "image/jpeg",
      "Content-Length": fileSize
    };

    const command = new PutObjectCommand(input);

    // showSuccess(`Attempting S3 upload for ${fileName}`); // Toast before the network call

    const response = await aws3.send(command);

    if (response.$metadata.httpStatusCode === 200) {
      // showSuccess(`S3 upload successful for ${fileName}`); // toast to check
      console.log(`Upload of photo: ${fileName} was sucessful`);
      return fileName;
    } else {
      showError(`S3 response was not a success: ${response.$metadata.httpStatusCode}`);
      return null;
    }

  } catch (error) {
    showError(`AWS S3 upload failed: ${error.message}`); // Toast on error
    console.error("AWS S3 upload failed:", error);
    return null;
  }
};

export const removePhoto = async (values) => {

  const shortPath = values.fileName.split("/").pop();

  if (shortPath) {
    const input = {
      "Bucket": "scubaseasons",
      "Key": shortPath
    };

    const command = new DeleteObjectCommand(input);
    const response = await aws3.send(command);

    // if (error) {
    //   console.log("couldn't upload,", error);
    // }

    if (response) {
      // console.log("cloudFlare", response)
      console.log(`Deletion of photo: ${shortPath} was sucessful`);
    }
  }

};

export const clearPhoto = async (values) => {

  const shortPath = values.split("/").pop();

  if (shortPath) {
    const input = {
      "Bucket": "scubaseasons",
      "Key": shortPath
    };

    const command = new DeleteObjectCommand(input);
    const response = await aws3.send(command);

    // if (error) {
    //   console.log("couldn't upload,", error);
    // }

    if (response) {
      // console.log("cloudFlare", response)
      console.log(`Deletion of photo: ${shortPath} was sucessful`);
    }
  }

};
export const removePhotoReviews = async (values) => {

  const shortPath = values.split("/").pop();

  if (shortPath) {
    const input = {
      "Bucket": "scubaseasons",
      "Key": shortPath
    };

    const command = new DeleteObjectCommand(input);
    const response = await aws3.send(command);

    // if (error) {
    //   console.log("couldn't upload,", error);
    // }

    if (response) {
      console.log(`Deletion of photo: ${shortPath} was sucessful`);
      return response;
    }
  }

};