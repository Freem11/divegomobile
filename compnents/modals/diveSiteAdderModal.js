import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { DSAdderContext } from "../contexts/DSModalContext";
import { insertDiveSiteWaits } from "../../supabaseCalls/diveSiteWaitSupabaseCalls";
// import { insertDiveSiteWaits } from "../../axiosCalls/diveSiteWaitAxiosCalls";
import { getCurrentCoordinates } from "../helpers/permissionsHelpers";
import { userCheck } from "../../supabaseCalls/authenticateSupabaseCalls";
import InsetShadow from "react-native-inset-shadow";
import { scale } from "react-native-size-matters";

let SiteNameVar = false;
let LatVar = false;
let LngVar = false;

export default function DiveSiteModal() {
  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );

  const [formVals, setFormVals] = useState({
    Site: "",
    Latitude: "",
    Longitude: "",
    UserID: null,
  });

  const [formValidation, SetFormValidation] = useState({
    SiteNameVal: false,
    LatVal: false,
    LngVal: false,
  });

  let UserId;

  useEffect(() => {
    const getUser = async () => {
      UserId = await userCheck();
      setFormVals({ ...formVals, UserID: UserId.id });
    };

    getUser();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setFormVals({
          ...formVals,
          Latitude: location.coords.latitude.toString(),
          Longitude: location.coords.longitude.toString(),
        });
        SetFormValidation({
          ...formValidation,
          SiteNameVal: false,
          LatVal: false,
          LngVal: false,
        });
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const handleSubmit = () => {
    if (formVals.Site === "" || formVals.Site === null) {
      SiteNameVar = true;
    } else {
      SiteNameVar = false;
    }

    if (
      formVals.Latitude === "" ||
      formVals.Latitude === null ||
      isNaN(formVals.Latitude)
    ) {
      LatVar = true;
    } else {
      LatVar = false;
    }

    if (
      formVals.Longitude === "" ||
      formVals.Longitude === null ||
      isNaN(formVals.Longitude)
    ) {
      LngVar = true;
    } else {
      LngVar = false;
    }

    SetFormValidation({
      ...formValidation,
      SiteNameVal: SiteNameVar,
      LatVal: LatVar,
      LngVal: LngVar,
    });

    if (
      formVals.Site === "" ||
      formVals.Latitude == "" ||
      isNaN(formVals.Latitude) ||
      formVals.Longitude == "" ||
      isNaN(formVals.Longitude)
    ) {
      return;
    } else {
      insertDiveSiteWaits(formVals);
      setFormVals({});
      setDiveSiteAdderModal(!diveSiteAdderModal);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InsetShadow
          containerStyle={{
            borderRadius: 25,
            height: 40,
            width: 200,
            marginRight: 18,
            marginTop: 1,
          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={formValidation.SiteNameVal ? styles.inputRed : styles.input}
            value={formVals.Site}
            placeholder={"Site Name"}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            fontSize={18}
            onChangeText={(siteText) =>
              setFormVals({ ...formVals, Site: siteText })
            }
          ></TextInput>
        </InsetShadow>

        <InsetShadow
          containerStyle={{
            borderRadius: 25,
            height: 40,
            width: 200,
            marginRight: 18,
            marginTop: 10,
          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={formValidation.LatVal ? styles.inputRed : styles.input}
            value={formVals.Latitude}
            placeholder={"Latitude"}
            keyboardType="numbers-and-punctuation"
            // editable={false}
            fontSize={18}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            onChangeText={(text) =>
              setFormVals({ ...formVals, Latitude: text })
            }
          ></TextInput>
        </InsetShadow>

        <InsetShadow
          containerStyle={{
            borderRadius: 25,
            height: 40,
            width: 200,
            marginRight: 18,
            marginTop: 12,
          }}
          elevation={20}
          shadowRadius={15}
          shadowOpacity={0.3}
        >
          <TextInput
            style={formValidation.LngVal ? styles.inputRed : styles.input}
            value={formVals.Longitude}
            placeholder={"Longitude"}
            keyboardType="numbers-and-punctuation"
            // editable={false}
            fontSize={18}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            onChangeText={(text) =>
              setFormVals({ ...formVals, Longitude: text })
            }
          ></TextInput>
        </InsetShadow>
      </View>

      <TouchableWithoutFeedback onPress={getCurrentLocation}>
        <View style={[styles.GPSbutton]}>
          <FontAwesome5 name="map" color="gold" size={28} />
          <Text
            style={{
              marginLeft: 5,
              fontFamily: "BubblegumSans_400Regular",
              color: "gold",
            }}
          >
            I'm at the dive site
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.SubmitButton}>
        <TouchableWithoutFeedback onPress={handleSubmit}>
          <Text
            style={{
              color: "gold",
              fontSize: 17,
              marginTop: 8,
              fontFamily: "PermanentMarker_400Regular",
              width: "100%",
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            Submit Dive Site
          </Text>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "40%",
    width: "100%",
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    fontFamily: "IndieFlower_400Regular",
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
    fontFamily: "IndieFlower_400Regular",
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
  GPSbutton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 35,
    width: 150,
    marginLeft: "30%",
    marginTop: scale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  SubmitButton: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 4,
    marginLeft: 70,
    borderWidth: 0.3,
    zIndex: 2,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? scale(-45) : scale(-105),
  },
  inputContainerLower: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    width: "45%",
  },
});
