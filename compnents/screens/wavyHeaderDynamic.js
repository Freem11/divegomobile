import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { colors } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function WavyHeaderDynamic({ image, defaultImg }) {
  const [picUri, setPicUri] = useState(null);

  useEffect(() => {
    if (image) {
      let photoName = image.split("/").pop();
      setPicUri(
        `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${photoName}`
      );
    } else {
      setPicUri(null)
    }
  }, [image, picUri]);

  return (
    <View style={styles.customStyles}>
        {picUri ? (
          <View style={styles.uploaderBackground}>
            <ImageBackground
              source={{ uri: picUri }}
              style={styles.backgroundImage}
            />
             </View>
        ) : (
          defaultImg === "diveSitePhoto" ?
          <View style={styles.uploaderBackground}>
            <ImageBackground
              source={require("../png/boat.png")}
              style={styles.backgroundImage}
            /> 
            </View>
            :
            <View style={styles.uploaderBackground}>
            <ImageBackground
            source={require("../png/blackManta.png")}
            style={styles.backgroundImage}
          /> 
          </View>
        )}
        <View
          style={{
            // flex: 1,
          justifyContent: 'flex-end',
          height: windowWidth > 600 ? "130%" : "150%",
          backgroundColor: "pink",
          }}
        >
          <Svg
            height={windowWidth > 600 ? "230%" : "230%"}
            width={windowWidth > 600 ? "100%" : "100%"}
            pointerEvents={'none'}
            viewBox="0 0 1440 320"
            style={{
              flex: 1,
              marginLeft: windowWidth > 600 ? "0%" : 0,
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
    zIndex: -1,
    backgroundColor: colors.themeWhite,
    resizeMode: 'cover',
    width: windowWidth,
    height: windowWidth > 600 ? "90%" : "90%",
},
  uploaderBackground: {
    alignItems: "center",
    backgroundColor: colors.primaryBlue,
    width: windowWidth,
    height: windowWidth > 600 ? "55%" : "60%",
  },
});
