import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import React, { useState, useEffect, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import { PinContext } from "../contexts/staticPinContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import { MasterContext } from "../contexts/masterContext";
import { PictureContext } from "../contexts/pictureContext";
import { SessionContext } from "../contexts/sessionContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { getToday } from "../helpers/picUploaderHelpers";
import { formatDate, createFile } from "../helpers/imageUploadHelpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FontAwesome5, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import AnimalAutoSuggest from "../autoSuggest/autoSuggest";
import ModalHeader from "../reusables/modalHeader";
import CompletnessIndicator from "../reusables/completnessIndicator";
import PrimaryButton from "../reusables/primaryButton";
import ModalSecondaryButton from "../reusables/modalSecondaryButton";
import SubmitButton from "../reusables/submitButton";
// import { uploadphoto, removePhoto } from "../../supabaseCalls/uploadSupabaseCalls";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";
import { insertPhotoWaits } from "../../supabaseCalls/photoWaitSupabaseCalls";
import { userCheck } from "../../supabaseCalls/authenticateSupabaseCalls";
import { scale, moderateScale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import { TutorialContext } from "../contexts/tutorialContext";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { ChapterContext } from "../contexts/chapterContext";
import { MapHelperContext } from "../contexts/mapHelperContext";
import { ModalSelectContext } from "../contexts/modalSelectContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import InputField from "../reusables/textInputs";
import SuccessModal from "./confirmationSuccessModal";
import FailModal from "./confirmationCautionModal";

let PicVar = false;
let DateVar = false;
let AnimalVar = false;
let LatVar = false;
let LngVar = false;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PicUploadModal() {
  const { largeModalSecond, setLargeModalSecond } = useContext(LargeModalSecondContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { chosenModal, setChosenModal } = useContext(ModalSelectContext);
  const { thirdGuideModal, setThirdGuideModal } = useContext(
    ThirdTutorialModalContext
  );
  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
  const { mapHelper, setMapHelper } = useContext(MapHelperContext);

  const { setMasterSwitch } = useContext(MasterContext);
  const { activeSession, setActiveSession } = useContext(SessionContext);
  const { profile, setProfile } = useContext(UserProfileContext);

  const [picCloseState, setPicCloseState] = useState(false);
  const [indicatorState, setIndicatorState] = useState(false);

  const { pinValues, setPinValues } = useContext(PinContext);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [date, setDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);
  const { uploadedFile, setUploadedFile } = useContext(PictureContext);
  const [pinChecker, setPinChecker] = useState(null);

  const [formValidation, SetFormValidation] = useState({
    PictureVal: false,
    DateVal: false,
    AnimalVal: false,
    LatVal: false,
    LngVal: false,
  });

  let counter = 0;
  let blinker;

  function imageBut() {
    counter++;
    if (counter % 2 == 0) {
      setImgButState(false);
    } else {
      setImgButState(true);
    }
  }

  function calendarBut() {
    counter++;
    if (counter % 2 == 0) {
      setDatButState(false);
    } else {
      setDatButState(true);
    }
  }

  function animalField() {
    counter++;
    if (counter % 2 == 0) {
      SetFormValidation({
        ...formValidation,
        AnimalVal: false,
      });
    } else {
      SetFormValidation({
        ...formValidation,
        AnimalVal: true,
      });
    }
  }

  function pinBut() {
    counter++;
    if (counter % 2 == 0) {
      setCorButState(false);
    } else {
      setCorButState(true);
    }
  }

  function subBut() {
    counter++;
    if (counter % 2 == 0) {
      setSubButState(false);
    } else {
      setSubButState(true);
    }
  }

  function cleanUp() {
    clearInterval(blinker);
    setImgButState(false);
    setDatButState(false);
    SetFormValidation({
      ...formValidation,
      AnimalVal: false,
    });
    setCorButState(false);
    setSubButState(false);
  }

  useEffect(() => {
    if (tutorialRunning) {
      if (itterator3 === 8) {
        blinker = setInterval(imageBut, 1000);
      } else if (itterator3 === 11) {
        blinker = setInterval(calendarBut, 1000);
      } else if (itterator3 === 14) {
        blinker = setInterval(animalField, 1000);
      } else if (itterator3 === 16) {
        blinker = setInterval(pinBut, 1000);
      } else if (itterator3 === 22) {
        blinker = setInterval(subBut, 1000);
      }
    }
    return () => cleanUp();
  }, [itterator3]);

  useEffect(() => {
    if (chapter === null) {
      if (tutorialRunning) {
        if (itterator3 > 0 && itterator3 !== 17) {
          setItterator3(itterator3 + 1);
        }
      }
    }
  }, [picAdderModal]);

  useEffect(() => {
    if (itterator3 === 6 || itterator3 === 9) {
      setThirdGuideModal(true);
    }
  }, [itterator3]);

  const onNavigate = () => {
    Keyboard.dismiss();
    setChosenModal("Photos");
    setMapHelper(true);
    setMasterSwitch(false);
    if (!tutorialRunning) {
      setPicAdderModal(false);
    }
    if (tutorialRunning) {
      if (itterator3 === 16) {
        setItterator3(itterator3 + 1);
      }
    }
  };

  useEffect(() => {
    let formattedDate = moment(date).format("YYYY-MM-DD");
    setPinValues({ ...pinValues, PicDate: formattedDate });
  }, [date]);

  const chooseImageHandler = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("image library permissions denied");
        return;
      }
    }

    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      exif: true,
    });

    try {
      return await chosenImage;
    } catch (e) {
      console.log({ title: "Image Upload", message: e.message });
    }
  };

  useEffect(() => {
    if (pinValues.PicDate === "") {
      let Rnow = new Date();

      let rightNow = getToday(Rnow);

      setPinValues({
        ...pinValues,
        PicDate: rightNow,
      });
    } else {
      setPinValues(pinValues);
    }
  }, []);

  const showDatePicker = () => {
    Keyboard.dismiss();
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date) => {
    let formattedDate = moment(date).format("YYYY-MM-DD");
    setPinValues({ ...pinValues, PicDate: formattedDate });
    if (tutorialRunning) {
      if (itterator3 === 11) {
        setItterator3(itterator3 + 1);
      }
    }
    hideDatePicker();
  };

  const GPSKeyBoardOffset1 = Platform.OS === "ios" ? 750 - 240 : 750 - 240;
  const GPSKeyBoardOffset2 = Platform.OS === "ios" ? 700 - 240 : 700 - 240;

  let colorDate;
  if (pinValues.PicDate === "") {
    colorDate = "darkgrey";
  } else {
    colorDate = "#F0EEEB";
  }

  const handleSubmit = () => {
    if (pinValues.PicFile === "" || pinValues.PicFile === null) {
      PicVar = true;
    } else {
      PicVar = false;
    }

    if (pinValues.PicDate === "" || pinValues.PicDate === null) {
      DateVar = true;
    } else {
      DateVar = false;
    }

    if (pinValues.Animal === "" || pinValues.Animal === null) {
      AnimalVar = true;
    } else {
      AnimalVar = false;
    }

    if (pinValues.Latitude === "" || pinValues.Latitude === null) {
      LatVar = true;
    } else {
      LatVar = false;
    }

    if (pinValues.Longitude === "" || pinValues.Longitude === null) {
      LngVar = true;
    } else {
      LngVar = false;
    }

    SetFormValidation({
      ...formValidation,
      PictureVal: PicVar,
      DateVal: DateVar,
      AnimalVal: AnimalVar,
      LatVal: LatVar,
      LngVal: LngVar,
    });

    if (
      pinValues.PicFile === "" ||
      pinValues.PicFile === null ||
      pinValues.PicDate === "" ||
      pinValues.Longitude === "" ||
      pinValues.Latitude === "" ||
      pinValues.Animal === ""
    ) {
      failBoxY.value = withTiming(scale(70));
      return;
    } else {
      if (tutorialRunning) {
        successBoxY.value = withTiming(scale(70));
      } else {
        insertPhotoWaits(pinValues);
        setPinValues({
          ...pinValues,
          PicFile: null,
          Animal: "",
          PicDate: "",
          Latitude: "",
          Longitude: "",
          DDVal: "0",
        });
        setUploadedFile(null);

        successBoxY.value = withTiming(scale(70));
      }
    }
  };

  const handleImageUpload = async () => {
    Keyboard.dismiss();
    setIsLoading(true);
    if (pinValues.PicFile !== null) {
      removePhoto({
        filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
        fileName: `${pinValues.PicFile}`,
      });
    }

    try {
      const image = await chooseImageHandler();
      if (image) {
        //scrape off photo info
        let formattedDate = pinValues.PicDate;
        let newLatitude = pinValues.Latitude;
        let newLongitude = pinValues.Longitude;
        let extension = image.assets[0].uri.split(".").pop();
        const fileName = Date.now() + "." + extension;

        if (image.assets[0].exif.DateTimeOriginal) {
          formattedDate = formatDate(image.assets[0].exif.DateTimeOriginal);
        }

        if (image.assets[0].exif.GPSLatitude) {
          newLatitude = image.assets[0].exif.GPSLatitude.toString();
          newLongitude = image.assets[0].exif.GPSLongitude.toString();
        }

        setPinValues({
          ...pinValues,
          PicFile: `animalphotos/public/${fileName}`,
          PicDate: formattedDate,
          Latitude: newLatitude,
          Longitude: newLongitude,
        });

        //create new photo file and upload
        setUploadedFile(image.assets[0].uri);
        setIsLoading(false);
        let picture = await fetch(image.assets[0].uri);
        picture = await picture.blob();
        uploadphoto(picture, fileName);

        DateVar = false;
        AnimalVar = false;
        LngVar = false;
        LatVar = false;

        SetFormValidation({
          ...formValidation,
          PictureVal: PicVar,
          DateVal: DateVar,
          AnimalVal: AnimalVar,
          LatVal: LatVar,
          LngVal: LngVar,
        });

        if (tutorialRunning) {
          if (itterator3 === 8) {
            setItterator3(itterator3 + 1);
          }
        }
      }
    } catch (e) {
      setIsLoading(false);
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  const togglePicModal = () => {
    if (tutorialRunning) {
      if (itterator3 === 9) {
        setItterator3(itterator3 + 1);
      } else if (
        itterator3 === 8 ||
        itterator3 === 11 ||
        itterator3 === 14 ||
        itterator3 === 16 ||
        itterator3 === 19 ||
        itterator3 === 22
      ) {
        return;
      } else {
        setPicAdderModal(!picAdderModal);
        if (pinValues.PicFile !== null) {
          removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: `${pinValues.PicFile}`,
          });
        }

        setUploadedFile(null);

        if (picAdderModal) {
          setPinValues({
            ...pinValues,
            PicFile: null,
            Animal: "",
            PicDate: "",
            Latitude: "",
            Longitude: "",
            DDVal: "0",
          });
        }
      }
    } else {
      setPreviousButtonID(activeButtonID);
      setActiveButtonID("PictureAdderButton");
      setLargeModalSecond(!largeModalSecond);
      failBoxY.value = withTiming(scale(1200));
      successBoxY.value = withTiming(scale(1200));
      SetFormValidation({
        PictureVal: false,
        DateVal: false,
        AnimalVal: false,
        LatVal: false,
        LngVal: false,
      });
      if (pinValues.PicFile !== null) {
        removePhoto({
          filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
          fileName: `${pinValues.PicFile}`,
        });
      }

      setUploadedFile(null);

      if (picAdderModal) {
        setPinValues({
          ...pinValues,
          PicFile: null,
          Animal: "",
          PicDate: "",
          Latitude: "",
          Longitude: "",
          DDVal: "0",
        });
      }
    }
  };

  const activateGuide = () => {
    setThirdGuideModal(true);
    setChapter("Adding your photo");
  };

  const [imgButState, setImgButState] = useState(false);
  const [datButState, setDatButState] = useState(false);
  const [corButState, setCorButState] = useState(false);
  const [subButState, setSubButState] = useState(false);
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
      pinValues.PicFile === "" ||
      pinValues.PicFile === null ||
      pinValues.PicDate === "" ||
      pinValues.Longitude === "" ||
      pinValues.Latitude === "" ||
      pinValues.Animal === ""
    ) {
      setIndicatorState(false);
    } else {
      setIndicatorState(true);
    }
  }, [pinValues]);

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <ModalHeader
          titleText={"Submit Your Picture"}
          onClose={togglePicModal}
          icon={"question-mark"}
          altButton={activateGuide}
        />

        <View style={styles.contentContainer}>
          <View style={styles.picContainer}>
            {uploadedFile && (
              <Image
                source={{
                  uri: `${uploadedFile}`,
                  // uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${uploadedFile}`,
                }}
                style={
                  formValidation.PictureVal
                    ? styles.imgStyleRed
                    : styles.imgStyle
                }
              />
            )}
            {!uploadedFile && !isLoading && (
              <View
                style={
                  formValidation.PictureVal
                    ? styles.imgStyleRed
                    : styles.imgStyle
                }
              />
            )}

            {!uploadedFile && isLoading && (
              <ActivityIndicator
                color="gold"
                style={{ marginTop: "5%", backgroundColor: "#538dbd" }}
              ></ActivityIndicator>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              marginTop: "-1%",
              marginBottom: "1%",
            }}
          >
            <PrimaryButton
              buttonAction={handleImageUpload}
              label={"Choose an Image"}
              icon={"picture-o"}
            />

            <CompletnessIndicator indicatorState={indicatorState} />
          </View>
          <View style={styles.lowerZone}>
            <View style={styles.fields}>
              <View style={styles.dateField}>
                <InputField
                  validationItem={formValidation.DateVal}
                  placeHolderText={"Date"}
                  inputValue={pinValues.PicDate}
                  keyboardType={"default"}
                  onChangeText={(text) =>
                    setPinValues({ ...pinValues, PicDate: text })
                  }
                />
              </View>

              <AnimalAutoSuggest
                pin={pinValues}
                setPin={setPinValues}
                formValidation={formValidation}
                SetFormValidation={SetFormValidation}
              />

              <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={GPSKeyBoardOffset1}
                style={styles.autocompleteA}
              >
                <View style={styles.latField}>
                  <InputField
                    validationItem={formValidation.LatVal}
                    placeHolderText={"Latitude"}
                    inputValue={pinValues.Latitude}
                    keyboardType={"numbers-and-punctuation"}
                    onChangeText={(text) =>
                      setPinValues({ ...pinValues, Latitude: text })
                    }
                  />
                </View>
              </KeyboardAvoidingView>

              <KeyboardAvoidingView
                behavior="position"
                keyboardVerticalOffset={GPSKeyBoardOffset2}
                style={styles.autocompleteB}
              >
                <View style={styles.lngField}>
                  <InputField
                    validationItem={formValidation.LngVal}
                    placeHolderText={"Longitude"}
                    inputValue={pinValues.Longitude}
                    keyboardType={"numbers-and-punctuation"}
                    onChangeText={(text) =>
                      setPinValues({ ...pinValues, Longitude: text })
                    }
                  />
                </View>
              </KeyboardAvoidingView>
            </View>

            <View style={styles.smallButtons}>
              <View style={styles.dateButton}>
                <ModalSecondaryButton
                  buttonAction={showDatePicker}
                  icon={"calendar-month"}
                />
                <DateTimePickerModal
                  isVisible={datePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </View>

              <View style={styles.animalButton}></View>

              <View style={styles.latLngButton}>
                <ModalSecondaryButton
                  buttonAction={onNavigate}
                  icon={"location-pin"}
                />
              </View>
            </View>
          </View>

          <SubmitButton buttonAction={handleSubmit} label={"Submit Photo"} />
        </View>
        <Animated.View style={[styles.confirmationBox, sucessModalSlide]}>
          <SuccessModal
            submissionItem="sea creature submission"
            togglePicModal={togglePicModal}
            confirmationSucessClose={confirmationSucessClose}
            itterator3={itterator3}
            setItterator3={setItterator3}
          ></SuccessModal>
        </Animated.View>

        <Animated.View style={[styles.confirmationBox, cautionModalSlide]}>
          <FailModal
            submissionItem="sea creature submission"
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
    // backgroundColor: "pink",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "pink",
  },
  picContainer: {
    marginTop: moderateScale(-70),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Platform.OS === "ios" ? moderateScale(10) : "2%",
    borderWidth: 0.3,
    borderRadius: scale(15),
    borderColor: "darkgrey",
    width: Platform.OS === "ios" ? "80%" : "80%",
    height: Platform.OS === "ios" ? "35%" : "35%",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,

    elevation: 10,
  },
  lowerZone: {
    flexDirection: "row",
    marginTop: windowWidth > 700 ? moderateScale(15) : moderateScale(20),
    width: windowWidth > 700 ? "80%" : "100%",
    // backgroundColor: "green",
    height: "32%",
  },
  fields: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-evenly",
    // backgroundColor: "orange",
    height: "100%",
    width: "70%",
  },
  smallButtons: {
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-evenly",
    marginTop: windowWidth > 700 ? scale(15) : scale(20),
    // backgroundColor: "pink",
    height: "100%",
    width: "25%",
  },
  dateField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    height: "25%",
    // backgroundColor: "yellow",
    marginBottom: scale(5),
  },
  dateButton: {
    width: "80%",
    height: "25%",
    // backgroundColor: "yellow"
  },
  animalField: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "pink",
    width: "80%",
    height: "25%",
    // marginTop: scale(-40),
    // marginTop: Platform.OS == "android" ? 7 : scale(-40),
    // marginBottom: Platform.OS == "android" ? -4 : scale(-20)
  },
  animalButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "25%",
    zIndex: -1,
    // backgroundColor: "maroon"
  },
  latField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // height: "25%",
    // zIndex: -1,
    // backgroundColor: "blue",
  },
  lngField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    // height: "25%",
    // zIndex: 2,
    // backgroundColor: "green",
  },
  latLngButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "50%",
    // backgroundColor: "green",
  },
  autocompleteA: {
    width: "80%",
    height: "25%",
    alignSelf: "center",
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "maroon",
    // marginLeft: scale(-10),
    marginTop: scale(5),
    // zIndex: 1
  },
  autocompleteB: {
    width: "80%",
    height: "25%",
    alignSelf: "center",
    justifyContent: "center",
    // alignItems: "center",
    // backgroundColor: "pink",
    // marginLeft: scale(-10),
    marginTop: scale(5),
    //zIndex: 1
  },
  imgStyle: {
    width: "101%",
    height: "101%",
    borderRadius: 15,
    backgroundColor: "#538bdb",
  },
  imgStyleRed: {
    width: "101%",
    height: "101%",
    borderRadius: 15,
    backgroundColor: "pink",
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
    marginTop: windowWidth > 700 ? moderateScale(25) : moderateScale(30),
  },
  ImageUploadIndicatorRed: {
    backgroundColor: "red",
    height: moderateScale(15),
    width: moderateScale(15),
    borderRadius: moderateScale(15),
    marginLeft: moderateScale(20),
    marginTop: windowWidth > 700 ? moderateScale(25) : moderateScale(30),
  },
});
