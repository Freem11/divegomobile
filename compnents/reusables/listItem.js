import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import CloseButtonSmall from "./closeButtonSmall";

const windowWidth = Dimensions.get("window").width;

export default function ListItem(props) {
  const { titleText, buttonAction} = props;

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
    backgroundColor: "#6496de",
    borderRadius: moderateScale(3)
  },
  titleBox: {
    width: "120%",
    paddingLeft: moderateScale(5)
    // backgroundColor: "purple"
  },
  titleText: {
    width:"70%",
    flexWrap: "wrap",
    fontFamily: "Itim_400Regular",
    color: "black",
    fontSize: moderateScale(12),
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
