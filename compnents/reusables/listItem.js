import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import CloseButtonSmall from "./closeButtonSmall";
import { activeFonts, colors, fontSizes } from "../styles";

const windowWidth = Dimensions.get("window").width;

export default function ListItem(props) {
  const { titleText, buttonAction} = props;

  console.log(props)
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.titleText}>{titleText}</Text>
      </View>
      <View style={styles.altButton}>
       <CloseButtonSmall onClose={buttonAction} />
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
    minHeight: moderateScale(30),
    width: "98%",
    overflow: "hidden",
    backgroundColor: colors.themeWhite,
    borderWidth: moderateScale(1),
    borderColor: "darkgrey",
    borderRadius: moderateScale(5),
  },
  titleBox: {
    width: "120%",
    paddingLeft: moderateScale(5)
    // backgroundColor: "purple"
  },
  titleText: {
    width:"70%",
    flexWrap: "wrap",
    fontFamily: activeFonts.Light,
    color: colors.themeBlack,
    fontSize: fontSizes.SmallText,
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
    marginRight: moderateScale(5)
  },
});
