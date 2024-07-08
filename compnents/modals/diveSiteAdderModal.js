import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
  Dimensions,
  Keyboard,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import React, { useState, useContext, useEffect } from "react";
import { DSAdderContext } from "../contexts/DSModalContext";
import { insertDiveSiteWaits } from "../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { getCurrentCoordinates } from "../helpers/permissionsHelpers";
import { scale, moderateScale } from "react-native-size-matters";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { SecondTutorialModalContext } from "../contexts/secondTutorialModalContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { ChapterContext } from "../contexts/chapterContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { MasterContext } from "../contexts/masterContext";
import { ModalSelectContext } from "../contexts/modalSelectContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import InputField from "../reusables/textInputs";
import SuccessModal from "./confirmationSuccessModal";
import FailModal from "./confirmationCautionModal";
import ModalHeader from "../reusables/modalHeader";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";
import SubmitButton from "../reusables/submitButton";
import CompletnessIndicator from "../reusables/completnessIndicator";

let SiteNameVar = false;
let LatVar = false;
let LngVar = false;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function DiveSiteModal() {
  const { smallModal, setSmallModal } = useContext(SmallModalContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );

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

  const [indicatorState, setIndicatorState] = useState(false);

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
    setPinButState(false);
    setSubButState(false);
  }
  useEffect(() => {
    if (tutorialRunning) {
      if (itterator2 === 16) {
        blinker1 = setInterval(pinBut, 600);
      } else if (itterator2 === 13) {
        blinker1 = setInterval(locationBut, 1000);
      } else if (itterator2 === 23) {
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
    Keyboard.dismiss();
    setIsLoading(true);
    setIsDisabled(true);
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
      if (tutorialRunning && itterator2 === 13) {
        setItterator2(itterator2 + 1);
      }
      setIsDisabled(true);
      setIsLoading(false);
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const onNavigate = () => {
    Keyboard.dismiss();
    if (itterator2 === 13 || itterator2 === 23) {
    } else {
      setChosenModal("DiveSite");
      setMapHelper(true);
      setMasterSwitch(false);
      setDiveSiteAdderModal(false);
      if (tutorialRunning) {
        setItterator2(itterator2 + 1);
      }
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
      failBoxY.value = withTiming(scale(70));
      return;
    } else {
      if (tutorialRunning) {
        successBoxY.value = withTiming(scale(70));
      } else {
        insertDiveSiteWaits(addSiteVals);
        setAddSiteVals({
          ...addSiteVals,
          Site: "",
          Latitude: "",
          Longitude: "",
        });

        successBoxY.value = withTiming(scale(70));
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
      setPreviousButtonID(activeButtonID);
      setActiveButtonID("DiveSiteAdderButton");
      setLargeModal(!largeModal);
      setSmallModal(false)
      failBoxY.value = withTiming(scale(1200));
      successBoxY.value = withTiming(scale(1200));
      SetFormValidation({
        SiteNameVal: false,
        LatVal: false,
        LngVal: false,
      });
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
    if (tutorialRunning) {
    } else {
      setSecondGuideModal(true);
      setChapter("DS Help");
    }
  };

  const [locButState, setLocButState] = useState(false);
  const [pinButState, setPinButState] = useState(false);
  const [subButState, setSubButState] = useState(false);
  const [corButState, setCorButState] = useState(false);
  const [helpButState, setHelpButState] = useState(false);

  const successBoxY = useSharedValue(scale(1200));
  const failBoxY = useSharedValue(scale(1200));

  const sucessModalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: successBoxY.value }],
    };
  });

  const cautionModalSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: failBoxY.value }],
    };
  });

  const confirmationSucessClose = () => {
    successBoxY.value = withTiming(scale(1200));
  };

  const confirmationFailClose = () => {
    failBoxY.value = withTiming(scale(1200));
  };

  useEffect(() => {
    if (
      addSiteVals.Site === "" ||
      addSiteVals.Latitude === "" ||
      addSiteVals.Longitude === ""
    ) {
      setIndicatorState(false);
    } else {
      setIndicatorState(true);
    }
  }, [addSiteVals]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ModalHeader
          titleText={"Submit Your Dive Site"}
          onClose={toggleDiveModal}
          icon={"question-mark"}
          altButton={activateGuide}
        />

        <View style={styles.contentContainer}>
          <View style={styles.inputContainer}>
            <InputField
              validationItem={formValidation.SiteNameVal}
              placeHolderText={"Site Name"}
              inputValue={addSiteVals.Site}
              keyboardType={"default"}
              onChangeText={(text) =>
                setAddSiteVals({ ...addSiteVals, Site: text })
              }
            />

            <InputField
              validationItem={formValidation.LatVal}
              placeHolderText={"Latitude"}
              inputValue={addSiteVals.Latitude}
              keyboardType={"numbers-and-punctuation"}
              onChangeText={(text) =>
                setAddSiteVals({ ...addSiteVals, Latitude: text })
              }
            />

            <InputField
              validationItem={formValidation.LngVal}
              placeHolderText={"Longitude"}
              inputValue={addSiteVals.Longitude}
              keyboardType={"numbers-and-punctuation"}
              onChangeText={(text) =>
                setAddSiteVals({ ...addSiteVals, Longitude: text })
              }
            />
          </View>

          {isLoading && (
            <ActivityIndicator
              color="gold"
              style={{ marginTop: "5%" }}
            ></ActivityIndicator>
          )}

          <View style={styles.latLngButton}>
            <ModalSecondaryButton
              buttonAction={getCurrentLocation}
              icon={"my-location"}
            />
            <ModalSecondaryButton
              buttonAction={onNavigate}
              icon={"location-pin"}
            />
            <View style={{ marginTop: moderateScale(-30) }}>
              <CompletnessIndicator indicatorState={indicatorState} />
            </View>
          </View>

          <SubmitButton
            buttonAction={handleSubmit}
            label={"Submit Dive Site"}
          />
        </View>
        <Animated.View style={[styles.confirmationBox, sucessModalSlide]}>
          <SuccessModal
            submissionItem="dive site"
            toggleDiveModal={toggleDiveModal}
            confirmationSucessClose={confirmationSucessClose}
            itterator2={itterator2}
            setItterator2={setItterator2}
          ></SuccessModal>
        </Animated.View>

        <Animated.View style={[styles.confirmationBox, cautionModalSlide]}>
          <FailModal
            submissionItem="dive site"
            confirmationFailClose={confirmationFailClose}
          ></FailModal>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    width: "100%",
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: {
    width: "96%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform.OS === "ios" ? "-20%" : "-20%",
  },
  inputContainerLower: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    width: "45%",
  },
  latLngButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: scale(-90),
    marginTop: 35,
    width: 140,
    // backgroundColor: "pink"
  },
  confirmationBox: {
    width: "100%",
    position: "absolute",
  },
  ImageUploadIndicatorGreen: {
    backgroundColor: "lightgreen",
    height: moderateScale(15),
    width: moderateScale(15),
    borderRadius: moderateScale(15),
    marginLeft: moderateScale(20),
    marginTop: scale(-2),
  },
  ImageUploadIndicatorRed: {
    backgroundColor: "red",
    height: moderateScale(15),
    width: moderateScale(15),
    borderRadius: moderateScale(15),
    marginLeft: moderateScale(20),
    marginTop: scale(-2),
  },
});
