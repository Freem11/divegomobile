import React from "react";
import { StyleSheet, View, Text, Dimensions, TouchableWithoutFeedback } from "react-native";
import { moderateScale } from "react-native-size-matters";
import CloseButtonSmall from "./closeButtonSmall";
import { activeFonts, colors, fontSizes } from "../styles";

const windowWidth = Dimensions.get("window").width;

export default function ListItem(props) {
  const { titleText, buttonAction} = props;
  
  return (
    <TouchableWithoutFeedback onPress={buttonAction}>
    <View style={styles.container}>
        <Text style={styles.titleText}>{titleText}</Text>
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: "1%",
    marginTop: "1%",
    marginLeft: "1%",
    minHeight: moderateScale(40),
    width: windowWidth -(windowWidth/100)*3,
    overflow: "hidden",
    backgroundColor: colors.themeWhite,
    borderWidth: moderateScale(1),
    borderColor: "darkgrey",
    borderRadius: moderateScale(5),
  },
  titleText: {
    fontFamily: activeFonts.Light,
    color: colors.themeBlack,
    fontSize: fontSizes.StandardText,
    // backgroundColor: "purple",
  },
  altButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    right: windowWidth > 600 ? moderateScale(0) : moderateScale(10),
    // backgroundColor: "pink",
    height: "100%",
    width: "10%",
    marginRight: moderateScale(-5)
  },
});
