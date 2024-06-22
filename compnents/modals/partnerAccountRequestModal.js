import {
  StyleSheet,
  Text,
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
import InsetShadow from "react-native-inset-shadow";
import { scale, moderateScale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { PartnerModalContext } from "../../compnents/contexts/partnerAccountRequestModalContext";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PartnerAccountRequestModal() {
  const { partnerModal, setPartnerModal } = useContext(
    PartnerModalContext
  );
  const [closeButtonState, setCloseButtonState] = useState(false);
  const [subButState, setSubButState] = useState(false);

  const handleSubmit = () => {}

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>Partner Account Request Form</Text>
        <View
          style={
            closeButtonState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={() => setPartnerModal(false)}
            onPressIn={() => setCloseButtonState(true)}
            onPressOut={() => setCloseButtonState(false)}
            style={{
              width: scale(30),
              height: scale(30),
              alignItems: "center",
            }}
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </TouchableOpacity>
        </View>
      </View>

      <View
          style={subButState ? styles.SubmitButtonPressed : styles.SubmitButton}
        >
          <TouchableOpacity
            onPress={handleSubmit}
            onPressIn={() => setSubButState(true)}
            onPressOut={() => setSubButState(false)}
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <Text
              style={{
                color: "gold",
                fontSize: moderateScale(26),
                marginTop: 4,
                marginBottom: -6,
                fontFamily: "PatrickHand_400Regular",
                width: "100%",
                alignSelf: "center",
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              Generate Email Request
            </Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    // backgroundColor: 'green',
    alignItems: "center",
    justifyContent: "center",
    marginTop: "5%",
    marginBottom: "2%",
    width: "98%",
    marginLeft: 2,
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  inputContainer: {
    width: "96%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? "-20%" : "-20%",
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
    textAlign: "center",
    overflow: "hidden",
  },
  header: {
    fontSize: 20,
    alignSelf: "center",
    marginBottom: 25,
    marginTop: -150,
  },
  text: {
    fontSize: 18,
    alignSelf: "center",
    marginBottom: 5,
  },
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "2%",
    marginLeft: "12%",
    width: "85%",
    height: scale(30),
  },
  header2: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(24),
    alignSelf: "center",
    height: scale(70),
    color: "#F0EEEB",
    marginTop: "11%",
    marginLeft: "7%",
    marginRight: "10%",
    // backgroundColor: "green"
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  SubmitButton: {
    position: "absolute",
    marginBottom: "0%",
    borderTopWidth: 0.5,
    width: "85%",
    borderTopColor: "darkgrey",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "1%" : "1%",
  },
  SubmitButtonPressed: {
    position: "absolute",
    marginBottom: "0%",
    borderTopWidth: 0.5,
    width: "85%",
    borderTopColor: "darkgrey",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "1%" : "1%",
    backgroundColor: "#538dbd",
  },
});
