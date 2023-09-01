import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { scale } from "react-native-size-matters";

const windowWidth = Dimensions.get("window").width;

export default function PhotoBoxModal(props) {
  const { picData, togglePhotoBoxModal } = props;

  const [photoCloseState, setPhotoCloseState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <View
          style={
            photoCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={() => togglePhotoBoxModal()}
            onPressIn={() => setPhotoCloseState(true)}
            onPressOut={() => setPhotoCloseState(false)}
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
      {/* <View style={styles.photoContainer}> */}
        <Image
          source={{
            uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${picData}`,
          }}
          style={{
            height: windowWidth/2,
            width: windowWidth,
            borderRadius: 15,
            borderColor: "grey",
          }}
        />
      {/* </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    marginTop: scale(-70),
    marginLeft: scale(-35)
  },
  title: {
    position: "absolute",
    top: "4%",
    left: "60%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "2%",
    marginLeft: "12%",
    width: "20%",
    height: scale(30),
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
});
