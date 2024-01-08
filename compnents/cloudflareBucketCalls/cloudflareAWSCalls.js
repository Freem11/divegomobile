import { aws3 } from "../../aws"
import {
    GetObjectCommand,
    PutObjectCommand,
    DeleteObjectCommand,
  } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import 'react-native-get-random-values'
import 'react-native-url-polyfill/auto';
import { ReadableStream } from 'web-streams-polyfill/ponyfill';
globalThis.ReadableStream = ReadableStream;
// import { Buffer } from "buffer";

export const uploadphoto = async (file, fileName) => {

    const input = {
        "Body": file,
        "Bucket": "scubaseasons",
        "Key": fileName,
        "ContentType": "image/jpeg",
    }

    const command = new PutObjectCommand(input)
    const response = await aws3.send(command)

    if (response) {
        // console.log("cloudFlare", response)
        console.log(`Upload of photo: ${fileName} was sucessful`)
    //   return data.path
    }
  };
  
  export const removePhoto = async (values) => {

    let shortPath = values.fileName.split('/').pop();

    const input = {
        "Bucket": "scubaseasons",
        "Key": shortPath
    }

    const command = new DeleteObjectCommand(input)
    const response = await aws3.send(command)
   
    // if (error) {
    //   console.log("couldn't upload,", error);
    // }
  
    if (response) {
        // console.log("cloudFlare", response)
        console.log(`Deletion of photo: ${shortPath} was sucessful`)
    }

    };