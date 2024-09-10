import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ImageBackground,
  Platform,
} from "react-native";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";
import { chooseImageHandler } from "./imageUploadHelpers";
import { moderateScale } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";
import { activeFonts, colors, fontSizes, primaryButtonAlt, buttonTextAlt } from "../styles";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function WavyHeaderUploader({ customStyles, image, setPinValues, pinValues }) {
  const [picUri, setPicUri] = useState(null);

  useEffect(() => {
    if (image) {
      let photoName = image.split("/").pop();
      setPicUri(
        `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${photoName}`
      );
    }
  }, [image]);


  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {
        let uri = image.assets[0].uri;
        let extension = image.assets[0].uri.split(".").pop();
        const fileName = Date.now() + "." + extension;

        //create new photo file and upload
        let picture = await fetch(uri);
        picture = await picture.blob();
        await uploadphoto(picture, fileName);
        if (
          pinValues.PicFile !== null ||
          pinValues.PicFile === ""
        ) {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: pinValues.PicFile.split("/").pop(),
          });
        }

        setPinValues({
          ...pinValues,
          PicFile: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  return (
    <View style={styles.customStyles}>
      {/* <View style={{ flex: 1, backgroundColor: "blue" }}> */}
        {picUri ? (
            <ImageBackground
              source={{ uri: picUri }}
              style={styles.backgroundImage}
            />
        ) : (
            <View style={styles.uploaderBackground}>
              <TouchableWithoutFeedback onPress={handleImageUpload}>
                <View style={styles.photoUploadButton}>
                  <Text style={styles.photoUploadText}>Upload a Photo</Text>
                </View>
              </TouchableWithoutFeedback>

            </View>
        )}
        <View
          style={{
            flex: 1,
            height: windowWidth > 600 ? "130%" : "100%",
            backgroundColor: "white",
          }}
        >
          <Svg
            height={windowWidth > 600 ? "175%" :"100%"}
            width={windowWidth > 600 ? "100%" : "100%"}
            viewBox="0 0 1440 320"
            style={{
              flex: 1,
              marginLeft: 0,
              marginTop: windowWidth > 600 ? "-80%" : "-80%",
              backgroundColor: "transparent",
              zIndex: 5,
            }}
          >
            <Path
              fill="#ffffff"
              d="M 0,700 L 0,262 C 123.33333333333331,187.60000000000002 246.66666666666663,113.20000000000002 401,132 C 555.3333333333334,150.79999999999998 740.6666666666667,262.8 919,300 C 1097.3333333333333,337.2 1268.6666666666665,299.6 1540,102 L 1440, 2200 L 0,2200 Z"
            />
          </Svg>
        </View>
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  customStyles: {
    flex: 1,
    height: windowHeight,
    backgroundColor: "pink",
  },
  backgroundImage: {
    backgroundColor: colors.themeWhite,
    marginLeft: windowWidth > 600 ? "-15%" : 0,
    width: windowWidth > 600 ? "120%" : windowWidth,
    height: windowWidth > 600 ? "70%" : "auto",
    aspectRatio: 1,
    marginTop: windowWidth > 600 ? moderateScale(0) : moderateScale(0),
  },
  uploaderBackground: {
    alignItems: 'center',
    backgroundColor: colors.primaryBlue,
    width: windowWidth,
    height: windowWidth > 600 ? "45%" : "40%"
  },
  photoUploadButton: [
    primaryButtonAlt,
    { flexDirection: "row", marginTop: windowWidth > 600 ? "50%" : "60%" },
  ],
  photoUploadText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
});
