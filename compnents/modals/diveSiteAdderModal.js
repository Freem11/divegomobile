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

let SiteNameVar = false;
let LatVar = false;
let LngVar = false;

export default function DiveSiteModal() {
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

  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);

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

  function siteTimeout() {
    blinker2 = setInterval(atSite, 1000)
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
    blinker3 = setInterval(subBut, 1000)
  }

  function cleanUp() {
    clearInterval(blinker1)
    clearInterval(blinker2)
    clearInterval(blinker3)
    clearTimeout(timer2)
    clearTimeout(timer3)
    SetFormValidation({
      ...formValidation,
      SiteNameVal: false,
    });
    setImaButState(false);
    setSubButState(false);
  }
  useEffect(() => {
    if (tutorialRunning) {
      if (itterator2 === 16) {
        blinker1 = setInterval(siteField, 1000);
        timer2 = setTimeout(siteTimeout,300);
        timer3 = setTimeout(subTimeout,600); 
      }
    } return () => cleanUp()
  }, [itterator2]);

  useEffect(() => {
    if(chapter === null){
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
    } catch (e) {
      console.log({ title: "Error", message: e.message });
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
      if (tutorialRunning) {
        if (itterator2 > 0) {
          setItterator2(itterator2 + 1);
        }
      } else {
        //  console.log("pinnies!", addSiteVals)
        insertDiveSiteWaits(addSiteVals);
        setAddSiteVals({
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
      } else if ( itterator2 === 16) {
          return
      } else {
        setDiveSiteAdderModal(!diveSiteAdderModal);

        if (diveSiteAdderModal) {
          setAddSiteVals({
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
          Site: "",
          Latitude: "",
          Longitude: "",
        });
      }
    }
  };
  const [imaButState, setImaButState] = useState(false);
  const [subButState, setSubButState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>Submit Your Dive Site</Text>
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

      <View style={imaButState ? styles.GPSbuttonPressed : styles.GPSbutton}>
        <TouchableOpacity
          onPress={getCurrentLocation}
          onPressIn={() => setImaButState(true)}
          onPressOut={() => setImaButState(false)}
          style={{
            display: "flex",
            flexDirection: "row",
            width: 130,
            height: 30,
            alignItems: "center",
          }}
        >
          <FontAwesome5 name="map" color="gold" size={16} />
          <Text
            style={{
              marginLeft: 5,
              fontFamily: "PatrickHand_400Regular",
              color: "gold",
              fontSize: 16
            }}
          >
            I'm at the dive site
          </Text>
        </TouchableOpacity>
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
