// styles.ts
import { StyleSheet, TextStyle, ViewStyle, ImageStyle, Dimensions } from 'react-native';
import {
    colors,
  } from "../../styles";

export interface Styles {
  wrapper: ViewStyle;
  page: ViewStyle;
  pageContainer: ViewStyle;
  pageContent: ViewStyle;
}

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create<Styles>({
    wrapper: {
        position: "absolute",
        height: "100%",
        width: windowWidth,
        backgroundColor: colors.themeWhite,
        zIndex: 26,
        left: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    page: {
        width: "100%",
        height: "100%",
        // backgroundColor: "pink"
    },
    pageContainer: {
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "pink"
    },
    pageContent: {
        // backgroundColor: "green",
        height: windowHeight,
        width: windowWidth,
        alignItems: "center",
  },
});

export default styles;
