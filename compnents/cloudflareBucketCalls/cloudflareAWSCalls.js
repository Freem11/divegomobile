import {
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

import { aws3 } from "../../aws"

import "react-native-get-random-values"
import "react-native-url-polyfill/auto";
import { ReadableStream } from "web-streams-polyfill/ponyfill";

import { Buffer } from "buffer";

globalThis.ReadableStream = ReadableStream;

export const uploadphoto = async(file, fileName) => {

  const fileBuffer = Buffer.from(file, "base64");
  const fileSize = fileBuffer.length;

  const input = {
    "Body": fileBuffer,
    "Bucket": "scubaseasons",
    "Key": fileName,
    "ContentType": "image/jpeg",
    "Content-Length": fileSize
  }

  const command = new PutObjectCommand(input)
  const response = await aws3.send(command)

  if (response) {
    // console.log("cloudFlare", response)
    console.log(`Upload of photo: ${fileName} was sucessful`)
    //   return data.path
  }
};
  
export const removePhoto = async(values) => {

  const shortPath = values.fileName.split("/").pop();

  if(shortPath){
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
  }

};