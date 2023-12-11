import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { FontAwesome5, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { DSAdderContext } from "../contexts/DSModalContext";
import { insertDiveSiteWaits } from "../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getCurrentCoordinates } from "../helpers/permissionsHelpers";
import { userCheck } from "../../supabaseCalls/authenticateSupabaseCalls";
import InsetShadow from "react-native-inset-shadow";
import { scale } from "react-native-size-matters";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { ChapterContext } from "../contexts/chapterContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { MasterContext } from "../contexts/masterContext";
import { ModalSelectContext } from "../contexts/modalSelectContext";

let SiteNameVar = false;
let LatVar = false;
let LngVar = false;

export default function DiveSiteModal() {
  const { chosenModal, setChosenModal } = useContext(ModalSelectContext);
  const { secondGuideModal, setSecondGuideModal } = useContext(
    SecondTutorialModalContext
  );
  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);

  const { diveSiteAdderModal, setDiveSiteAdderModal } = useContext(
    DSAdderContext
  );
  const [diveCloseState, setDiveCloseState] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { mapHelper, setMapHelper } = useContext(MapHelperContext);
  const { setMasterSwitch } = useContext(MasterContext);

  const [formValidation, SetFormValidation] = useState({
    SiteNameVal: false,
    LatVal: false,
    LngVal: false,
  });

  let counter1 = 0;
  let counter2 = 0;
  let counter3 = 0;
  let blinker1;
  let blinker2;
  let blinker3;
  let timer2;
  let timer3;

  function locationBut() {
    counter1++;
    if (counter1 % 2 == 0) {
      setLocButState(false);
    } else {
      setLocButState(true);
    }
  }

  function pinBut() {
    counter1++;
    if (counter1 % 2 == 0) {
      setPinButState(false);
    } else {
      setPinButState(true);
    }
  }

  function siteField() {
    counter1++;
    if (counter1 % 2 == 0) {
      SetFormValidation({
        ...formValidation,
        SiteNameVal: false,
      });
    } else {
      SetFormValidation({
        ...formValidation,
        SiteNameVal: true,
      });
    }
  }

  function atSite() {
    counter2++;
    if (counter2 % 2 == 0) {
      setImaButState(false);
    } else {
      setImaButState(true);
    }
  }

  function subButTimeout() {
    blinker2 = setInterval(subBut, 1000);
  }

  function subBut() {
    counter3++;
    if (counter3 % 2 == 0) {
      setSubButState(false);
    } else {
      setSubButState(true);
    }
  }

  function subTimeout() {
    blinker3 = setInterval(subBut, 1000);
  }

  function cleanUp() {
    clearInterval(blinker1);
    clearInterval(blinker2);
    clearInterval(blinker3);
    clearTimeout(timer2);
    clearTimeout(timer3);
    SetFormValidation({
      ...formValidation,
      SiteNameVal: false,
    });
    setLocButState(false);
    setPinButState(false)
    setSubButState(false);
  }
  useEffect(() => {
    if (tutorialRunning) {
      if (itterator2 === 16) {
        blinker1 = setInterval(pinBut, 600);
      } else if (itterator2 === 13){
        blinker1 = setInterval(locationBut, 1000);
      } else if (itterator2 === 23){
        blinker1 = setInterval(siteField, 1000);
        timer2 = setTimeout(subButTimeout, 300);
      }
    }
    return () => cleanUp();
  }, [itterator2]);

  useEffect(() => {
    if (chapter === null) {
      if (tutorialRunning) {
        if (itterator2 === 9) {
          setItterator2(itterator2 + 1);
        }
      }
    }
  }, [diveSiteAdderModal]);

  useEffect(() => {
    if (itterator2 === 10 || itterator2 === 17) {
      setSecondGuideModal(true);
    }
  }, [itterator2]);

  const getCurrentLocation = async () => {
    setIsLoading(true)
    setIsDisabled(true)
    try {
      const location = await getCurrentCoordinates();
      if (location) {
        setAddSiteVals({
          ...addSiteVals,
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
      if (tutorialRunning && itterator2 === 13){
        setItterator2( itterator2 + 1)
      }
      setIsDisabled(true)
      setIsLoading(false)
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const onNavigate = () => {
    setChosenModal("DiveSite");
    setMapHelper(true);
    setMasterSwitch(false);
    setDiveSiteAdderModal(false);
    if (tutorialRunning) {
      setItterator2(itterator2 + 1)
    }
  };

  const handleSubmit = () => {
    if (addSiteVals.Site === "" || addSiteVals.Site === null) {
      SiteNameVar = true;
    } else {
      SiteNameVar = false;
    }

    if (
      addSiteVals.Latitude === "" ||
      addSiteVals.Latitude === null ||
      isNaN(addSiteVals.Latitude)
    ) {
      LatVar = true;
    } else {
      LatVar = false;
    }

    if (
      addSiteVals.Longitude === "" ||
      addSiteVals.Longitude === null ||
      isNaN(addSiteVals.Longitude)
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
      addSiteVals.Site === "" ||
      addSiteVals.Latitude == "" ||
      isNaN(addSiteVals.Latitude) ||
      addSiteVals.Longitude == "" ||
      isNaN(addSiteVals.Longitude)
    ) {
      return;
    } else {
      console.log("here?", tutorialRunning, itterator2)
      if (tutorialRunning) {
        if (itterator2 > 0) {
          setItterator2(itterator2 + 1);
        }
      } else {
        //  console.log("pinnies!", addSiteVals)
        insertDiveSiteWaits(addSiteVals);
        setAddSiteVals({
          ...addSiteVals,
          Site: "",
          Latitude: "",
          Longitude: "",
        });
        setDiveSiteAdderModal(!diveSiteAdderModal);
      }
    }
  };

  const toggleDiveModal = () => {
    if (tutorialRunning) {
      if (itterator2 === 9) {
        setItterator2(itterator2 + 1);
      } else if (itterator2 === 16) {
        return;
      } else {
        setDiveSiteAdderModal(!diveSiteAdderModal);

        if (diveSiteAdderModal) {
          setAddSiteVals({
            ...addSiteVals,
            Site: "",
            Latitude: "",
            Longitude: "",
          });
        }
      }
    } else {
      setDiveSiteAdderModal(!diveSiteAdderModal);

      if (diveSiteAdderModal) {
        setAddSiteVals({
          ...addSiteVals,
          Site: "",
          Latitude: "",
          Longitude: "",
        });
      }
    }
  };

  const activateGuide = () => {
      setChapter("DS Help")
  };

  const [locButState, setLocButState] = useState(false);
  const [pinButState, setPinButState] = useState(false);
  const [subButState, setSubButState] = useState(false);
  const [corButState, setCorButState] = useState(false);
  const [helpButState, setHelpButState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>Submit Your Dive Site</Text>
        <View style={helpButState ? styles.helpButtonPressed : styles.helpButton}>
          <TouchableOpacity
            // disabled={isDisabled}
            onPress={activateGuide}
            onPressIn={() => setHelpButState(true)}
            onPressOut={() => setHelpButState(false)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: scale(20),
              height: scale(20),
            }}
          >
            <FontAwesome5
              name="question"
              color="gold"
              size={scale(18)}
              style={{ zIndex: -1}}
            />
          </TouchableOpacity>
        </View>
        <View
          style={
            diveCloseState ? styles.closeButtonPressed : styles.closeButton
          }
        >
          <TouchableOpacity
            onPress={toggleDiveModal}
            onPressIn={() => setDiveCloseState(true)}
            onPressOut={() => setDiveCloseState(false)}
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
            value={addSiteVals.Site}
            placeholder={"Site Name"}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            fontSize={18}
            onChangeText={(siteText) =>
              setAddSiteVals({ ...addSiteVals, Site: siteText })
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
            value={addSiteVals.Latitude}
            placeholder={"Latitude"}
            keyboardType="numbers-and-punctuation"
            // editable={false}
            fontSize={18}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            onChangeText={(text) =>
              setAddSiteVals({ ...addSiteVals, Latitude: text })
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
            value={addSiteVals.Longitude}
            placeholder={"Longitude"}
            keyboardType="numbers-and-punctuation"
            // editable={false}
            fontSize={18}
            placeholderTextColor="darkgrey"
            color="#F0EEEB"
            onChangeText={(text) =>
              setAddSiteVals({ ...addSiteVals, Longitude: text })
            }
          ></TextInput>
        </InsetShadow>
      </View>

      {isLoading && (
        <ActivityIndicator
          color="gold"
          style={{ marginTop: "5%" }}
        ></ActivityIndicator>
      )}

      <View style={styles.latLngButton}>
        <View style={locButState ? styles.GPSbuttonPressed : styles.GPSbutton}>
          <TouchableOpacity
            // disabled={isDisabled}
            onPress={getCurrentLocation}
            onPressIn={() => setLocButState(true)}
            onPressOut={() => setLocButState(false)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: 38,
              height: 38,
            }}
          >
            <MaterialIcons
              name="my-location"
              color="gold"
              size={34}
              style={{ zIndex: -1 }}
            />
          </TouchableOpacity>
        </View>

        <View style={pinButState ? styles.LocButtonPressed : styles.LocButton}>
          <TouchableOpacity
            onPress={onNavigate}
            onPressIn={() => setCorButState(true)}
            onPressOut={() => setCorButState(false)}
            style={{
              width: 38,
              height: 38,
            }}
          >
            <MaterialIcons
              name="location-pin"
              color="gold"
              size={38}
              style={{ zIndex: -1 }}
            />
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
              fontSize: 26,
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
            Submit Dive Site
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
  GPSbutton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 40,
    width: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  GPSbuttonPressed: {
    backgroundColor: "#538dbd",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 40,
    width: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    elevation: 10,
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
    fontFamily: "PatrickHand_400Regular",
    fontSize: scale(26),
    alignSelf: "center",
    color: "#F0EEEB",
    width: "80%",
    marginTop: "-1%",
    marginLeft: "7%",
    marginRight: "15%",
    // backgroundColor: "green"
  },
  closeButton: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(5),
  },
  closeButtonPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(5),
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  latLngButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: "10%",
    marginTop: 35,
    width: 140,
    // backgroundColor: "pink"
  },
  LocButton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 40,
    width: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  LocButtonPressed: {
    backgroundColor: "#538dbd",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 40,
    width: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,

    elevation: 10,
  },
  helpButton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(5),
    marginLeft: scale(-20),
    borderRadius: 40,
    height: scale(30),
    width: scale(30),
    marginTop: scale(1)
  },
  helpButtonPressed: {
    backgroundColor: "#538dbd",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(5),
    marginLeft: scale(-20),
    borderRadius: 40,
    height: scale(30),
    width: scale(30),
    marginTop: scale(1)
  },
});
