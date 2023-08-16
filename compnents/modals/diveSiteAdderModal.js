import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
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
  const [diveCloseState, setDiveCloseState] = useState(false);

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
      try {
        UserId = await userCheck();
        setFormVals({ ...formVals, UserID: UserId.id });
      } catch (e) {
        console.log({ title: "Error", message: e.message });
      }
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

  const [imaButState, setImaButState] = useState(false);
  const [subButState, setSubButState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>Submit Your Dive Site</Text>
        <TouchableWithoutFeedback
          onPress={() => setDiveSiteAdderModal(!diveSiteAdderModal)}
          onPressIn={() => setDiveCloseState(true)}
          onPressOut={() => setDiveCloseState(false)}
        >
          <View
            style={
              diveCloseState ? styles.closeButtonPressed : styles.closeButton
            }
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(24)} />
          </View>
        </TouchableWithoutFeedback>
      </View>
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

      <TouchableWithoutFeedback
        onPress={getCurrentLocation}
        onPressIn={() => setImaButState(true)}
        onPressOut={() => setImaButState(false)}
      >
        <View style={imaButState ? styles.GPSbuttonPressed : styles.GPSbutton}>
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

      <View
        style={subButState ? styles.SubmitButtonPressed : styles.SubmitButton}
      >
        <TouchableWithoutFeedback
          onPress={handleSubmit}
          onPressIn={() => setSubButState(true)}
          onPressOut={() => setSubButState(false)}
        >
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
  GPSbuttonPressed: {
    backgroundColor: "#538dbd",
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
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  SubmitButton: {
    position: "absolute",
    marginBottom: "0%",
    borderWidth: 1,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "1%" : "1%",
  },
  SubmitButtonPressed: {
    position: "absolute",
    marginBottom: "0%",
    borderWidth: 1,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "1%" : "1%",
    backgroundColor: "#538dbd",
  },
  inputContainerLower: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    width: "45%",
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
    width: "80%",
    height: scale(30),
  },
  header2: {
    fontFamily: "PermanentMarker_400Regular",
    fontSize: scale(17),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginLeft: "0%",
    marginRight: "18%",
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
});