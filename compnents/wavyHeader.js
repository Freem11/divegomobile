import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";

const windowWidth = Dimensions.get("window").width;

/**
 * Custom Path:
 * Starts LOW (350), Peaks at 25% (50),
 * Dips at 75% (450), Ends HIGH (150).
 */
const CustomWave = () => (
  <Path
    fill="white"
    d="M0,350
       C250,50 250,50 500,250
       S750,450 1000,150
       V500 H0 Z"
  />
);

export default function WavyHeader() {
  return (
    <View style={styles.container}>
      {/* 1. The Background Image */}
      <ImageBackground
        style={styles.backgroundImage}
        source={require("./png/blackManta.png")}
      />

      {/* 2. The Wave Layer */}
      <View style={styles.waveContainer}>
        <Svg
          width={windowWidth}
          height={moderateScale(180)}
          viewBox="0 0 1000 1400"
          preserveAspectRatio="none"
        >
          <CustomWave />
        </Svg>
      </View>

      {/* 3. The Content Area */}
      <View style={styles.contentArea} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  backgroundImage: {
    width: windowWidth,
    aspectRatio: 1,
  },
  waveContainer: {
    position: "absolute",
    // This value controls where the wave starts cutting the image
    top: windowWidth - moderateScale(80),
    width: windowWidth,
    zIndex: 10,
  },
  contentArea: {
    flex: 1,
    backgroundColor: "white",
  },
});