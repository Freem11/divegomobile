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
import { moderateScale } from "react-native-size-matters";
import Svg, { Path } from "react-native-svg";
import { colors } from "../styles";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function WavyHeaderDynamic({ customStyles, image }) {
  const [picUri, setPicUri] = useState(null);

  useEffect(() => {
    if (image) {
      let photoName = image.split("/").pop();
      setPicUri(
        `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${photoName}`
      );
    }
  }, [image]);

  return (
    <View style={styles.customStyles}>
      {/* <View style={{ flex: 1, backgroundColor: "blue" }}> */}
        {picUri ? (
            <ImageBackground
              source={{ uri: picUri }}
              style={styles.backgroundImage}
            />
        ) : (
            <ImageBackground
              source={require("../png/blackManta.png")}
              style={styles.backgroundImage}
            />
        )}
        <View
          style={{
            flex: 1,
            height: windowWidth > 600 ? "130%" : "100%",
            backgroundColor: "white",
          }}
        >
          <Svg
            height="100%"
            width={windowWidth > 600 ? "140%" : "100%"}
            viewBox="0 0 1440 320"
            style={{
              flex: 1,
              marginLeft: windowWidth > 600 ? "-20%" : 0,
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
    // alignItems: "center",
    // justifyContent: "center",
    marginLeft: windowWidth > 600 ? "-15%" : 0,
    width: windowWidth > 600 ? "120%" : windowWidth,
    height: windowWidth > 600 ? "70%" : "auto",
    aspectRatio: 1,
    marginTop: windowWidth > 600 ? moderateScale(0) : moderateScale(0),
  },
});
