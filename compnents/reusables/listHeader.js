import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import TinyButton from "./tinyButton";

const windowWidth = Dimensions.get("window").width;

export default function ListHeader(props) {
  const { titleText, buttonAction, buttonText } = props;

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>{titleText}</Text>
      </View>
      <View style={styles.altButton}>
        {buttonAction && <TinyButton buttonAction={buttonAction} buttonText={buttonText} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1%",
    marginTop: "1%",
    minHeight: moderateScale(40),
    width: "98%",
    overflow: "hidden",
    backgroundColor: "lightgrey",
    borderRadius: moderateScale(3)
  },
  titleBox: {
    width: "120%",
    // backgroundColor: "purple"
  },
  titleText: {
    width:"70%",
    flexWrap: "wrap",
    fontFamily: "Itim_400Regular",
    color: "black",
    fontSize: moderateScale(14),
    // backgroundColor: "purple",
  },
  altButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: windowWidth > 600 ? moderateScale(0) : moderateScale(10),
    // backgroundColor: "pink",
    height: "100%",
    width: "25%",
    marginRight: moderateScale(5)
  },
});
