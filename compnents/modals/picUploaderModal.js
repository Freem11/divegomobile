import {
  StyleSheet,
  View,
  Image,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { registerForPhotoLibraryAccessAsync } from "../tutorial/photoLibraryRegistery";
import { TouchableWithoutFeedback as Toucher } from "react-native-gesture-handler";
import React, { useState, useEffect, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import { PinContext } from "../contexts/staticPinContext";
import { PictureContext } from "../contexts/pictureContext";
import { getToday } from "../helpers/picUploaderHelpers";
import { formatDate } from "../helpers/imageUploadHelpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import AnimalAutoSuggest from "../autoSuggest/autoSuggest";
import ModalHeader from "../reusables/modalHeader";
import CompletnessIndicator from "../reusables/completnessIndicator";
import PrimaryButton from "../reusables/primaryButton";
import SubmitButton from "../reusables/submitButton";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";
import { insertPhotoWaits } from "../../supabaseCalls/photoWaitSupabaseCalls";
import { scale, moderateScale } from "react-native-size-matters";
import { TutorialContext } from "../contexts/tutorialContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { ChapterContext } from "../contexts/chapterContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveConfirmationIDContext } from "../contexts/activeConfirmationIDContext";
import { ConfirmationTypeContext } from "../contexts/confirmationTypeContext";
import { ConfirmationModalContext } from "../contexts/confirmationModalContext";
import InputField from "../reusables/textInputs";

let PicVar = false;
let DateVar = false;
let AnimalVar = false;
let LatVar = false;
let LngVar = false;
const windowWidth = Dimensions.get("window").width;

export default function PicUploadModal() {
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(
    LargeModalSecondContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);

  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);

  const { itterator3, setItterator3 } = useContext(Iterrator3Context);
  const { tutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);

  const [indicatorState, setIndicatorState] = useState(false);

  const { pinValues, setPinValues } = useContext(PinContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [date, setDate] = useState(new Date());

  const [isLoading, setIsLoading] = useState(false);
  const { uploadedFile, setUploadedFile } = useContext(PictureContext);

  const [formValidation, SetFormValidation] = useState({
    PictureVal: false,
    DateVal: false,
    AnimalVal: false,
    LatVal: false,
    LngVal: false,
  });

  let counter = 0;
  let blinker;
  const [datButState, setDatButState] = useState(false);
  const [corButState, setCorButState] = useState(false);
  const [subButState, setSubButState] = useState(false);

  function calendarField() {
    counter++;
    if (counter % 2 == 0) {
      SetFormValidation({
        ...formValidation,
        DateVal: false,
      });
    } else {
      SetFormValidation({
        ...formValidation,
        DateVal: true,
      });
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

  function pinButtonBlink() {
    counter++;
    if (counter % 2 == 0) {
      setCorButState(false);
    } else {
      setCorButState(true);
    }
  }

  function submitButtonBlink() {
    counter++;
    if (counter % 2 == 0) {
      setSubButState(false);
    } else {
      setSubButState(true);
    }
  }

  function cleanUp() {
    clearInterval(blinker);
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
      if (itterator3 === 14) {
        blinker = setInterval(calendarField, 1000);
      } else if (itterator3 === 16) {
        blinker = setInterval(animalField, 1000);
      } else if (itterator3 === 16) {
        blinker = setInterval(pinButtonBlink, 1000);
      } else if (itterator3 === 19) {
        blinker = setInterval(submitButtonBlink, 1000);
      }
    }
    return () => cleanUp();
  }, [itterator3]);

  useEffect(() => {
    if (chapter === null) {
      if (tutorialRunning) {
        if (itterator3 > 0 && itterator3 !== 17 && itterator3 !== 9) {
          setItterator3(itterator3 + 1);
        }
      }
    }
  }, [largeModalSecond]);

  useEffect(() => {
    if (itterator3 === 6 || itterator3 === 9) {
      setFullScreenModal(true);
      setActiveTutorialID("ThirdGuide");
    }
  }, [itterator3]);

  useEffect(() => {
    let formattedDate = moment(date).format("YYYY-MM-DD");
    setPinValues({ ...pinValues, PicDate: formattedDate });
  }, [date]);

  const chooseImageHandler = async () => { 
    if (Platform.OS !== "web") {
     await registerForPhotoLibraryAccessAsync()
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

  const handleConfirm = (passedDate) => {
    let formattedDate = moment(passedDate).format("YYYY-MM-DD");
    if (passedDate > date) return;

    setPinValues({ ...pinValues, PicDate: formattedDate });
    if (tutorialRunning) {
      if (itterator3 === 14) {
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
      setConfirmationType("Sea Creature Submission");
      setActiveConfirmationID("ConfirmationCaution");
      setConfirmationModal(true);
      return;
    } else {
      if (tutorialRunning) {
        setConfirmationType("Sea Creature Submission");
        setActiveConfirmationID("ConfirmationSuccess");
        setConfirmationModal(true);
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

        setConfirmationType("Sea Creature Submission");
        setActiveConfirmationID("ConfirmationSuccess");
        setConfirmationModal(true);
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
        let uri = image.assets[0].uri;
        let extension = image.assets[0].uri.split(".").pop();
        const fileName = Date.now() + "." + extension;

        if (image.assets[0].exif.DateTimeOriginal) {
          formattedDate = formatDate(image.assets[0].exif.DateTimeOriginal);
        }

        // if (image.assets[0].exif.GPSLatitude) {
        //   newLatitude = image.assets[0].exif.GPSLatitude.toString();
        //   newLongitude = image.assets[0].exif.GPSLongitude.toString();
        // }

        setPinValues({
          ...pinValues,
          PicFile: `animalphotos/public/${fileName}`,
          PicDate: formattedDate,
          Latitude: newLatitude,
          Longitude: newLongitude,
        });

        //create new photo file and upload
        setUploadedFile(uri);
        setIsLoading(false);
        let picture = await fetch(uri);
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
          if (itterator3 === 11) {
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
      if (
        itterator3 === 8 ||
        itterator3 === 11 ||
        itterator3 === 14 ||
        itterator3 === 16 ||
        itterator3 === 19 ||
        itterator3 === 22
      ) {
        return;
      } else {
        setLargeModalSecond(false);
        if (pinValues.PicFile !== null) {
          removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: `${pinValues.PicFile}`,
          });
        }

        setUploadedFile(null);

        if (largeModalSecond) {
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
      setLargeModalSecond(false);
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

      if (largeModalSecond) {
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
    setFullScreenModal(true);
    setActiveTutorialID("ThirdGuide");
    setChapter("Adding your photo");
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
              marginTop: "0%",
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
            <View style={styles.dateField}>
              <Toucher
                onPress={() => showDatePicker()}
                style={{
                  marginTop: moderateScale(10),
                  marginBottom: moderateScale(10),
                }}
              >
                <View pointerEvents="none">
                  <InputField
                    validationItem={formValidation.DateVal}
                    placeHolderText={"Date"}
                    inputValue={pinValues.PicDate}
                    keyboardType={"default"}
                  />
                </View>
              </Toucher>
            </View>

            <View style={styles.animalField}>
              <AnimalAutoSuggest
                pin={pinValues}
                setPin={setPinValues}
                formValidation={formValidation}
                SetFormValidation={SetFormValidation}
              />
            </View>

            <View style={styles.latField}>
              <View pointerEvents="none">
                <InputField
                  placeHolderText={"Dive Site"}
                  inputValue={pinValues.siteName}
                  keyboardType={"default"}
                />
              </View>
            </View>

            {/* <KeyboardAvoidingView
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
            </KeyboardAvoidingView> */}
          </View>

          <SubmitButton
            buttonAction={handleSubmit}
            label={"Submit Photo"}
            blink={subButState}
          />

          <DateTimePickerModal
            isVisible={datePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: windowWidth > 700 ? moderateScale(25) : moderateScale(20),
    width: windowWidth > 700 ? "80%" : "100%",
    // backgroundColor: "green",
    height: "35%",
  },
  dateField: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "25%",
    marginBottom: scale(5),
  },
  animalField: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "73%",
    height: "25%",
  },
  latField: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: moderateScale(15)
  },
  lngField: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  autocompleteA: {
    width: "80%",
    height: "25%",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: scale(5),
  },
  autocompleteB: {
    width: "80%",
    height: "25%",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: scale(5),
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
});
