import {
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { scale, moderateScale } from "react-native-size-matters";
import bubbles from "../png/bubbles.png";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function CommentsModal() {
  const [tutorialsCloseState, setTutorialsCloseState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.commentListContainer}></View>

      <View style={styles.commentEntryContainer}>
        <TextInput
          style={styles.input}
          // value={pinValues.Latitude}
          placeholder={"Blow some bubbles"}
          placeholderTextColor="darkgrey"
          fontSize={moderateScale(16)}
          color={"grey"}
          multiline={true}
          // onChangeText={(text) =>
          //   setPinValues({ ...pinValues, Latitude: text })
          // }
        ></TextInput>
        <TouchableWithoutFeedback onPress={() => null}>
          <Image
            source={bubbles}
            style={[
              {
                height: moderateScale(36),
                width: moderateScale(36),
              },
            ]}
          />
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    // backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginBottom: "2%",
    width: "98%",
    marginLeft: "1%",
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  commentListContainer: {
    // backgroundColor: "pink",
    width: "100%",
    height: "85%",
    borderBottomColor: "lightgrey",
    borderBottomWidth: 0.2
  },
  commentEntryContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "black",
    width: "90%",
    height: "15%",
  },
  input: {
    flex: 1,
    fontFamily: "Itim_400Regular",
    backgroundColor: "white",
    borderRadius: moderateScale(20),
    width: moderateScale(280),
    height: moderateScale(40),
    alignSelf: "center",
    justifyContent: "center",
    textAlign: "center",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    paddingTop: moderateScale(10),
    paddingRight: moderateScale(15),
    paddingLeft: moderateScale(15),
    marginRight: moderateScale(5),
    marginLeft: moderateScale(-7)
  },
});
