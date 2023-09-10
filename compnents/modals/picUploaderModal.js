import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
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
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import AnimalAutoSuggest from "../autoSuggest/autoSuggest";
import { uploadphoto } from "../../supabaseCalls/uploadSupabaseCalls";
import { removePhoto } from "../../supabaseCalls/uploadSupabaseCalls";
import { insertPhotoWaits } from "../../supabaseCalls/photoWaitSupabaseCalls";
import { userCheck } from "../../supabaseCalls/authenticateSupabaseCalls";
import { scale } from "react-native-size-matters";
import InsetShadow from "react-native-inset-shadow";
import { TutorialContext } from "../contexts/tutorialContext";
import { ThirdTutorialModalContext } from "../contexts/thirdTutorialModalContext";
import { Iterrator3Context } from "../contexts/iterrator3Context";
import { ChapterContext } from "../contexts/chapterContext";
import { MapHelperContext } from "../contexts/mapHelperContext";

let PicVar = false;
let DateVar = false;
let AnimalVar = false;
let LatVar = false;
let LngVar = false;
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function PicUploadModal() {
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

  const { pinValues, setPinValues } = useContext(PinContext);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const [date, setDate] = useState(new Date());

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
      const {
        status,
      } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("image library permissions denied");
        return;
      }
    }

    let chosenImage = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
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

  const AnimalKeboardOffset = Platform.OS === "ios" ? 300 : 0;

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
      return;
    } else {
      if (tutorialRunning) {
        if (itterator3 > 0) {
          setItterator3(itterator3 + 1);
        }
      } else {
        // console.log("pinnies!", pinValues)
        insertPhotoWaits(pinValues);
        setPinValues({
          PicFile: null,
          Animal: "",
          PicDate: "",
          Latitude: "",
          Longitude: "",
          DDVal: "0",
        });
        setUploadedFile(null);
        setPicAdderModal(!picAdderModal);
      }
    }
  };

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {
        let formattedDate;
        let newLatitude;
        let newLongitude;

        if (image.assets[0].exif.DateTimeOriginal) {
          formattedDate = formatDate(image.assets[0].exif.DateTimeOriginal);
          DateVar = false;
        } else {
          formattedDate = pinValues.PicDate;
        }

        if (image.assets[0].exif.GPSLatitude) {
          newLatitude = image.assets[0].exif.GPSLatitude.toString();
          newLongitude = image.assets[0].exif.GPSLongitude.toString();
        } else {
          newLatitude = pinValues.Latitude;
          newLongitude = pinValues.Longitude;
        }

        if (pinValues.PicFile !== null) {
          removePhoto({
            filePath: "./wetmap/src/components/uploads/",
            fileName: uploadedFile,
          });
        }

        AnimalVar = false;
        LngVar = false;
        LatVar = false;

        let fileToUpload = createFile(image.assets[0].uri);
        const data = new FormData();
        data.append("image", fileToUpload);

        const newFilePath = await uploadphoto(data, image.assets[0].uri);
        setUploadedFile(newFilePath);

        setPinValues({
          ...pinValues,
          PicFile: newFilePath,
          PicDate: formattedDate,
          Latitude: newLatitude,
          Longitude: newLongitude,
        });

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
            filePath: "./wetmap/src/components/uploads/",
            fileName: uploadedFile,
          });
        }

        setUploadedFile(null);

        if (picAdderModal) {
          setPinValues({
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
      setPicAdderModal(!picAdderModal);

      if (pinValues.PicFile !== null) {
        removePhoto({
          filePath: "./wetmap/src/components/uploads/",
          fileName: uploadedFile,
        });
      }

      setUploadedFile(null);

      if (picAdderModal) {
        setPinValues({
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

  const [imgButState, setImgButState] = useState(false);
  const [datButState, setDatButState] = useState(false);
  const [corButState, setCorButState] = useState(false);
  const [subButState, setSubButState] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.title}>
        <Text style={styles.header2}>Submit Your Picture</Text>
        <View
          style={picCloseState ? styles.closeButtonPressed : styles.closeButton}
        >
          <TouchableOpacity
            onPress={togglePicModal}
            onPressIn={() => setPicCloseState(true)}
            onPressOut={() => setPicCloseState(false)}
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
      <View style={styles.picContainer}>
        <Image
          source={{
            uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/${uploadedFile}`,
          }}
          style={
            formValidation.PictureVal ? styles.imgStyleRed : styles.imgStyle
          }
        />
      </View>

      <View
        style={imgButState ? styles.ImageButtonPressed : styles.ImageButton}
      >
        <TouchableOpacity
          onPress={handleImageUpload}
          onPressIn={() => setImgButState(true)}
          onPressOut={() => setImgButState(false)}
          style={{
            display: "flex",
            flexDirection: "row",
            width: scale(150),
            height: scale(24),
            marginTop: 2,
          }}
        >
          <FontAwesome
            name="picture-o"
            color="gold"
            size={scale(24)}
            style={{
              marginLeft: Platform.OS === "android" ? scale(10) : scale(10),
            }}
          />
          <Text
            style={{
              marginLeft: scale(5),
              marginTop: scale(-2),
              color: "gold",
              fontFamily: "PatrickHand_400Regular",
              fontSize: scale(17),
            }}
          >
            Choose an Image
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lowerZone}>
        <View style={styles.fields}>
          <View style={styles.dateField}>
            <InsetShadow
              containerStyle={{
                borderRadius: 25,
                height: 40,
                width: 200,
              }}
              elevation={20}
              shadowColor={"black"}
              shadowRadius={15}
              shadowOpacity={0.3}
            >
              <TextInput
                style={
                  formValidation.DateVal ? styles.inputCalRed : styles.inputCal
                }
                value={pinValues.PicDate}
                placeholder={"Date"}
                placeholderTextColor="darkgrey"
                editable={false}
                color={colorDate}
                fontSize={17}
                placeholderTextColor={colorDate}
                onChangeText={(text) =>
                  setPinValues({ ...pinValues, Animal: text })
                }
              ></TextInput>
            </InsetShadow>
          </View>

          <View style={styles.animalField}>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={AnimalKeboardOffset}
              style={styles.autocomplete}
            >
              <AnimalAutoSuggest
                pin={pinValues}
                setPin={setPinValues}
                formValidation={formValidation}
                SetFormValidation={SetFormValidation}
              />
            </KeyboardAvoidingView>
          </View>

          <View style={styles.latField}>
            <InsetShadow
              containerStyle={{
                borderRadius: 25,
                height: 40,
                width: 200,
              }}
              elevation={20}
              shadowColor={"black"}
              shadowRadius={15}
              shadowOpacity={0.3}
            >
              <TextInput
                style={formValidation.LatVal ? styles.inputRed : styles.input}
                value={pinValues.Latitude}
                placeholder={"Latitude"}
                editable={false}
                placeholderTextColor="darkgrey"
                fontSize={16}
                color="#F0EEEB"
                onChangeText={(text) =>
                  setPinValues({ ...pinValues, Latitude: text })
                }
              ></TextInput>
            </InsetShadow>
          </View>
          <View style={styles.lngField}>
            <InsetShadow
              containerStyle={{
                borderRadius: 25,
                height: 40,
                width: 200,
              }}
              elevation={20}
              shadowColor={"black"}
              shadowRadius={15}
              shadowOpacity={0.3}
            >
              <TextInput
                style={formValidation.LngVal ? styles.inputRed : styles.input}
                value={pinValues.Longitude}
                placeholder={"Longitude"}
                editable={false}
                placeholderTextColor="darkgrey"
                fontSize={16}
                color="#F0EEEB"
                onChangeText={(text) =>
                  setPinValues({ ...pinValues, Longitude: text })
                }
              ></TextInput>
            </InsetShadow>
          </View>
        </View>

        <View style={styles.smallButtons}>
          <View style={styles.dateButton}>
            <View
              style={datButState ? styles.dateIconPressed : styles.dateIcon}
            >
              <TouchableOpacity
                onPress={showDatePicker}
                onPressIn={() => setDatButState(true)}
                onPressOut={() => setDatButState(false)}
                style={{
                  width: 28,
                  height: 32,
                }}
              >
                <FontAwesome
                  name="calendar"
                  color="gold"
                  size={28}
                  style={{ marginLeft: 1.5, marginTop: 2 }}
                />
                <DateTimePickerModal
                  // date={new Date(pinValues.PicDate)}
                  isVisible={datePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.animalButton}></View>

          <View style={styles.latLngButton}>
            <View
              style={corButState ? styles.LocButtonPressed : styles.LocButton}
            >
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
              borderColor: "transparent",
              width: "100%",
              alignSelf: "center",
              justifyContent: "center",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            Submit Photo
          </Text>
        </TouchableOpacity>
        {/* </TouchableWithoutFeedback> */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    alignItems: "center",
    marginTop: "5%",
    width: "100%",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    minHeight: Platform.OS === "android" ? 490 : 0,
    // backgroundColor: "pink",
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    textAlign: "center",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    textAlign: "center",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
  },
  inputCal: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    textAlign: "center",
  },
  inputCalRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    textAlign: "center",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
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
  ImageButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
    height: "7%",
    width: "50%",
    marginLeft: 0,
    marginTop: Platform.OS === "ios" ? "2%" : "3%",
    // marginBottom: Platform.OS === "ios" ? "3%" : "6%",
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 10,
  },
  ImageButtonPressed: {
    backgroundColor: "#538dbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: scale(15),
    height: "7%",
    width: "50%",
    marginLeft: 0,
    marginTop: Platform.OS === "ios" ? "2%" : "3%",
    // marginBottom: Platform.OS === "ios" ? "3%" : "6%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    elevation: 10,
  },
  picContainer: {
    backgroundColor: "#D8DBE2",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15%",
    marginBottom: Platform.OS === "ios" ? "3%" : "2%",
    borderWidth: 0.3,
    borderRadius: scale(15),
    borderColor: "darkgrey",
    width: Platform.OS === "ios" ? "80%" : "80%",
    height: Platform.OS === "ios" ? "35%" : "35%",
    // marginTop: Platform.OS === "ios" ? "-5%" : "-30%",
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
    marginTop: windowWidth > 700 ? scale(5) : scale(20),
    width: windowWidth > 700 ? "50%" : "100%",
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
    // backgroundColor: "pink",
    height: "100%",
    width: "30%",
  },
  dateField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    height: "25%",
    // backgroundColor: "lightblue"
  },
  dateButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "25%",
    // backgroundColor: "green"
  },
  animalField: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    height: "25%",
    // backgroundColor: "green"
  },
  animalButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "25%",
    // backgroundColor: "lightblue"
  },
  latField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    height: "25%",
    zIndex: -1,
    // backgroundColor: "blue"
  },
  lngField: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "80%",
    height: "25%",
    zIndex: -1,
    // backgroundColor: "pink"
  },
  latLngButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    height: "50%",
    // backgroundColor: "green"
  },
  modalStyle: {
    flex: 1,
    backgroundColor: "#D8DBE2",
    borderRadius: 20,
    margin: 70,
    marginTop: 300,
    marginBottom: 300,
    borderColor: "#D8DBE2",
    borderWidth: 8,
    opacity: 1,
  },
  closeButton: {
    borderRadius: 42 / 2,
    backgroundColor: "maroon",
    height: 34,
    width: 34,
    marginLeft: 170,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
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
  autocomplete: {
    width: 200,
    height: 30,
    alignSelf: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  SubmitButton: {
    position: "absolute",
    marginBottom: "0%",
    borderWidth: 1,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "2%" : "2%",
  },
  SubmitButtonPressed: {
    position: "absolute",
    marginBottom: "0%",
    borderWidth: 1,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "2%" : "2%",
    backgroundColor: "#538dbd",
  },
  dateIcon: {
    backgroundColor: "#538bdb",
    alignItems: "center",
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
  dateIconPressed: {
    backgroundColor: "#538dbd",
    alignItems: "center",
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
  title: {
    position: "absolute",
    top: "-1%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "2%",
    // marginLeft: "32%",
    width: "80%",
    height: scale(30),
    // backgroundColor: "green"
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
