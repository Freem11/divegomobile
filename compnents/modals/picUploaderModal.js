import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import * as ImagePicker from "expo-image-picker";
import { PinContext } from "../contexts/staticPinContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import { MasterContext } from "../contexts/masterContext";
import { PictureContext } from "../contexts/pictureContext";
import { SessionContext } from "../contexts/sessionContext";
import { getToday } from "../helpers/picUploaderHelpers";
import { formatDate, createFile } from "../helpers/imageUploadHelpers";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import moment from "moment";
import AnimalAutoSuggest from "../autoSuggest/autoSuggest";
import { uploadphoto } from "../../supabaseCalls/uploadSupabaseCalls";
import { removePhoto } from "../../supabaseCalls/uploadSupabaseCalls";
import { insertPhotoWaits } from "../../supabaseCalls/photoWaitSupabaseCalls";
import { scale } from "react-native-size-matters";
import { userCheck } from "../../supabaseCalls/authenticateSupabaseCalls";
import InsetShadow from "react-native-inset-shadow";

let PicVar = false;
let DateVar = false;
let AnimalVar = false;
let LatVar = false;
let LngVar = false;

export default function PicUploadModal() {
  const { setMasterSwitch } = useContext(MasterContext);
  const { activeSession, setActiveSession } = useContext(SessionContext);

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

  const onNavigate = () => {
    setMasterSwitch(false);
    setPicAdderModal(!picAdderModal);
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

    const getUser = async () => {
      let UserID = await userCheck();
      setPinValues({ ...pinValues, UserId: UserID.id });
    };

    getUser();
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
    hideDatePicker();
  };

  const AnimalKeboardOffset = Platform.OS === "ios" ? 350 : 0;

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
      console.log("wha?", pinValues)
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
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  return (
    <View style={styles.container}>
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

      <TouchableWithoutFeedback onPress={handleImageUpload}>
        <View style={[styles.ImageButton]}>
          <FontAwesome name="picture-o" color="gold" size={28} />
          <Text
            style={{
              marginLeft: scale(5),
              color: "gold",
              fontFamily: "IndieFlower_400Regular",
              fontSize: scale(14),
            }}
          >
            Choose an Image
          </Text>
        </View>
      </TouchableWithoutFeedback>

      <View style={styles.calZone}>
        <InsetShadow
          containerStyle={{
            borderRadius: 25,
            height: 40,
            width: 200,
            marginRight: 18,
            marginLeft: 1,
            marginTop: 2,
          }}
          elevation={20}
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
            fontSize={21}
            placeholderTextColor={colorDate}
            onChangeText={(text) =>
              setPinValues({ ...pinValues, Animal: text })
            }
          ></TextInput>
        </InsetShadow>
        <TouchableWithoutFeedback onPress={showDatePicker}>
          <View style={styles.dateIcon}>
            <FontAwesome name="calendar" color="gold" size={28} style={{marginLeft: 1.5, marginTop: 2}}/>
            <DateTimePickerModal
              // date={new Date(pinValues.PicDate)}
              isVisible={datePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>

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

      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          marginBottom: "5%",
          marginRight: 5
        }}
      >
        <View style={{marginLeft: 5}}>
          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 10,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.3}
          >
            <TextInput
              style={formValidation.LatVal ? styles.inputRed : styles.input}
              value={pinValues.Latitude}
              placeholder={"Latitude"}
              editable={false}
              placeholderTextColor="darkgrey"
              fontSize={18}
              color="#F0EEEB"
              onChangeText={(text) =>
                setPinValues({ ...pinValues, Latitude: text })
              }
            ></TextInput>
          </InsetShadow>

          <InsetShadow
            containerStyle={{
              borderRadius: 25,
              height: 40,
              width: 200,
              marginRight: 7,
              marginTop: 15,
            }}
            elevation={20}
            shadowRadius={15}
            shadowOpacity={0.3}
          >
            <TextInput
              style={formValidation.LngVal ? styles.inputRed : styles.input}
              value={pinValues.Longitude}
              placeholder={"Longitude"}
              editable={false}
              placeholderTextColor="darkgrey"
              fontSize={18}
              color="#F0EEEB"
              onChangeText={(text) =>
                setPinValues({ ...pinValues, Longitude: text })
              }
            ></TextInput>
          </InsetShadow>
        </View>

        <View style={{ marginLeft: 25, marginTop: 15 }}>
          <TouchableWithoutFeedback onPress={onNavigate}>
            <View style={[styles.LocButton]}>
              <MaterialIcons
                name="location-pin"
                color="gold"
                size={38}
                style={{ zIndex: -1 }}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>

      <View style={styles.SubmitButton}>
        <TouchableWithoutFeedback onPress={handleSubmit}>
          <Text
            style={{
              color: "gold",
              fontSize: 17,
              marginTop: 8,
              fontFamily: "PermanentMarker_400Regular",
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
    width: "100%",
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  input: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    width: 205,
    height: 40,
    alignSelf: "center",
    marginBottom: 25,
    textAlign: "center",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  inputRed: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: 205,
    height: 40,
    alignSelf: "center",
    marginBottom: 15,
    marginLeft: -5,
    textAlign: "center",
    overflow: "hidden",
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 0 },
  },
  inputCal: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 15,
    textAlign: "center",
  },
  inputCalRed: {
    fontFamily: "IndieFlower_400Regular",
    backgroundColor: "pink",
    borderRadius: 10,
    width: 200,
    height: 40,
    alignSelf: "center",
    marginBottom: 15,
    textAlign: "center",
    marginRight: 20,
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    height: scale(35),
    width: scale(160),
    marginLeft: 0,
    marginTop: 15,
    marginBottom: scale(25),
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 10,
  },
  picContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: scale(10),
    borderWidth: 0.3,
    borderRadius: scale(15),
    borderColor: "darkgrey",
    width: scale(220),
    height: scale(110),
    marginTop: -90,
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    elevation: 20,
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
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
    backgroundColor: "#538bdb",
    borderRadius: 10,
    marginLeft: -15,
    marginTop: 15,
    width: 38,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,

    elevation: 10,
  },
  calZone: {
    flexDirection: "row",
    justifyContent: "center",
    marginLeft: 2,
    marginBottom: 0,
  },
  autocomplete: {
    width: 275,
    height: 30,
    marginTop: 20,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
    marginLeft: 15,
    zIndex: 20,
  },
  SubmitButton: {
    position: "absolute",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    borderWidth: 1,
    width: "85%",
    borderTopColor: "darkgrey",
    borderColor: "transparent",
    borderBottomColor: "transparent",
    bottom: Platform.OS === "android" ? "2%" : "2%",
  },
  dateIcon: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 10,
    height: 35,
    width: 38,
    marginTop: 3,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
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
});
