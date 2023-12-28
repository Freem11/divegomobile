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
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { grabProfileById } from "../../supabaseCalls/accountSupabaseCalls";
import { scale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function FailModal(props) {
  const {
    submissionItem,
    confirmationFailClose,
  } = props;

  const [profileCloseState, setProfileCloseState] = useState(false);

  const tidyUp = () => {
    confirmationFailClose();
  };

  let blurb;
  if (submissionItem === "sea creature submission"){
      blurb = "The Image has not yet completed processing, please wait for the indicator to turn green, which indicates that it is ready, and try again."
  } else if (submissionItem === "dive site"){
      blurb = "You dive site submission is still missing required information, please make changes and when the indicator to turns green your submission will be ready to submit."
  }

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.text}>
          Your {submissionItem} cannot be completed just yet.
        </Text>
        <Text style={styles.text2}>
          {blurb}
        </Text>
        <View
          style={profileCloseState ? styles.OKbuttonPressed : styles.OKbutton}
        >
          <TouchableWithoutFeedback
            onPress={() => tidyUp()}
            onPressIn={() => setProfileCloseState(true)}
            onPressOut={() => setProfileCloseState(false)}
          >
            <Text
              style={{
                color: "gold",
                fontSize: 17,
                opacity: 1,
                fontFamily: "PermanentMarker_400Regular",
                width: "100%",
                alignSelf: "center",
                justifyContent: "center",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              Ok
            </Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "10%",
    marginBottom: "0%",
    margin: scale(10),
  },
  text2: {
    fontSize: 18,
    color: "#36454F",
    fontFamily: "Itim_400Regular",
    alignSelf: "center",
    textAlign: "center",
    marginTop: "5%",
    marginBottom: "7%",
    margin: scale(35),
  },
  OKbutton: {
    backgroundColor: "#fa8072",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.55,
    shadowRadius: 6.27,

    elevation: 10,
  },
  OKbuttonPressed: {
    opacity: 1,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: scale(35),
    width: scale(150),
    // marginLeft: "30%",
    // marginTop: scale(10),
    marginBottom: scale(20),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
});
