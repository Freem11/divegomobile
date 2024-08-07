import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { insertDiveSiteWaits } from "../../supabaseCalls/diveSiteWaitSupabaseCalls";
import { getCurrentCoordinates } from "../helpers/permissionsHelpers";
import { scale, moderateScale } from "react-native-size-matters";
import { DiveSpotContext } from "../contexts/diveSpotContext";
import { Iterrator2Context } from "../contexts/iterrator2Context";
import { ChapterContext } from "../contexts/chapterContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { MapConfigContext } from "../contexts/mapConfigContext";
import { ModalSelectContext } from "../contexts/modalSelectContext";
import { SmallModalContext } from "../contexts/smallModalContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import InputField from "../reusables/textInputs";
import ModalHeader from "../reusables/modalHeader";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";
import SubmitButton from "../reusables/submitButton";
import CompletnessIndicator from "../reusables/completnessIndicator";

let SiteNameVar = false;
let LatVar = false;
let LngVar = false;

export default function DiveSiteModal() {
  const { setMapConfig } = useContext(MapConfigContext);
  const { setSmallModal } = useContext(SmallModalContext);
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { fullScreenModal, setFullScreenModal } = useContext(
    FullScreenModalContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setChosenModal } = useContext(ModalSelectContext);

  const { itterator2, setItterator2 } = useContext(Iterrator2Context);
  const { tutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);

  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const [indicatorState, setIndicatorState] = useState(false);

  const { addSiteVals, setAddSiteVals } = useContext(DiveSpotContext);
  const { setMapHelper } = useContext(MapHelperContext);

  const [formValidation, SetFormValidation] = useState({
    SiteNameVal: false,
    LatVal: false,
    LngVal: false,
  });

  let counter1 = 0;
  let counter3 = 0;
  let blinker1;
  let blinker2;
  let blinker3;
  let timer2;
  let timer3;

  const [locButState, setLocButState] = useState(false);
  const [pinButState, setPinButState] = useState(false);
  const [subButState, setSubButState] = useState(false);

  function locationButtonBlink() {
    counter1++;
    if (counter1 % 2 == 0) {
      setLocButState(false);
    } else {
      setLocButState(true);
    }
  }

  function pinButtonBlink() {
    counter1++;
    if (counter1 % 2 == 0) {
      setPinButState(false);
    } else {
      setPinButState(true);
    }
  }

  function submitButtonBlink() {
    counter3++;
    if (counter3 % 2 == 0) {
      setSubButState(false);
    } else {
      setSubButState(true);
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

  function subButTimeout() {
    blinker2 = setInterval(submitButtonBlink, 1000);
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
        blinker1 = setInterval(pinButtonBlink, 600);
      } else if (itterator2 === 13) {
        blinker1 = setInterval(locationButtonBlink, 1000);
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
  }, [fullScreenModal]);

  useEffect(() => {
    if (itterator2 === 10 || itterator2 === 17) {
      setFullScreenModal(true);
      setActiveTutorialID("SecondGuide");
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
      setMapConfig(1);
      setLargeModal(false);
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
      setConfirmationType("Dive Site");
      setActiveConfirmationID("ConfirmationCaution");
      setConfirmationModal(true);
      return;
    } else {
      if (itterator2 === 23) {
        setConfirmationType("Dive Site");
        setActiveConfirmationID("ConfirmationSuccess");
        setConfirmationModal(true);
        setItterator2(itterator2 + 1)
      } else {
        insertDiveSiteWaits(addSiteVals);
        setAddSiteVals({
          ...addSiteVals,
          Site: "",
          Latitude: "",
          Longitude: "",
        });
        setConfirmationType("Dive Site");
        setActiveConfirmationID("ConfirmationSuccess");
        setConfirmationModal(true);
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
        if (fullScreenModal) {
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
      setLargeModal(false);
      setSmallModal(false);
      SetFormValidation({
        SiteNameVal: false,
        LatVal: false,
        LngVal: false,
      });
        setAddSiteVals({
          ...addSiteVals,
          Site: "",
          Latitude: "",
          Longitude: "",
        });
    }
  };

  const activateGuide = () => {
    if (tutorialRunning) {
    } else {
      setFullScreenModal(true);
      setActiveTutorialID("SecondGuide");
      setChapter("DS Help");
    }
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

            <View style={styles.spacer}>
              <InputField
                validationItem={formValidation.LatVal}
                placeHolderText={"Latitude"}
                inputValue={addSiteVals.Latitude}
                keyboardType={"numbers-and-punctuation"}
                onChangeText={(text) =>
                  setAddSiteVals({ ...addSiteVals, Latitude: text })
                }
              />
            </View>
            <View style={styles.spacer}>
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
              blink={locButState}
            />
            <ModalSecondaryButton
              buttonAction={onNavigate}
              icon={"location-pin"}
              blink={pinButState}
            />
            <View style={{ marginTop: moderateScale(-30) }}>
              <CompletnessIndicator indicatorState={indicatorState} />
            </View>
          </View>

          <SubmitButton
            buttonAction={handleSubmit}
            label={"Submit Dive Site"}
            blink={subButState}
          />
        </View>
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
  latLngButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginLeft: scale(-90),
    marginTop: moderateScale(30),
    width: 140,
    // backgroundColor: "pink"
  },
  spacer: {
    marginTop: moderateScale(20),
  },
});
