import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ScrollView,
  Platform,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import WavyHeaderDynamic from "./wavyHeaderDynamic";
import PlainTextInput from "./plaintextInput";
import { activeFonts, colors, fontSizes } from "../styles";
import screenData from "./screenData.json";
import { moderateScale } from "react-native-size-matters";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";

import { UserProfileContext } from "../contexts/userProfileContext";
import { getPhotosByUserWithExtra } from '../../supabaseCalls/photoSupabaseCalls';
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";
import { MaterialIcons } from "@expo/vector-icons";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import { chooseImageHandler } from "./imageUploadHelpers";
import BottomDrawer from "./animatedBottomDrawer";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UserProfile(props) {
  const {} = props;
  const { profile } = useContext(UserProfileContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const [userFail, setUserFail] = useState("");
  const [profileVals, setProfileVals] = useState(null);
  const [tempUserName, setTempUserName] = useState("");
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  const drawerUpperBound = "90%";
  const drawerLowerBound = "30%";

  const grabBoobs = async () => {
    const success = await getPhotosByUserWithExtra(profile[0].UserID);
    console.log("DATA_PROFILE", success)
  }
  
  useEffect(() => {
    grabBoobs()
  }, [])

  useEffect(() => {
    setProfileVals({
      id: profile[0].UserID,
      userName: profile[0].UserName,
      bio: profile[0].profileBio,
      photo: profile[0].profilePhoto,
    });
    setTempUserName(profile[0].UserName);
  }, []);

  useEffect(() => {
    setUserFail("");

    if (!isEditModeOn && profileVals) {
      profileUpdate();
    }
  }, [isEditModeOn]);

  const profileUpdate = async () => {
    if (profileVals.userName === "") {
      setUserFail("Your diver name cannot be blank!");
      setProfileVals({ ...profileVals, userName: tempUserName });
    } else {
      try {
        const success = await updateProfile({
          id: profileVals.id,
          username: profileVals.userName,
          bio: profileVals.bio,
          photo: profileVals.profilePhoto,
        });
        if (success[0].length === 0 && profileVals) {
          setProfileVals({ ...profileVals, userName: tempUserName });
          setUserFail("Sorry that diver name has already been taken");
        }
      } catch (e) {
        setProfileVals({ ...profileVals, userName: tempUserName });
        setUserFail("Sorry that diver name has already been taken");
        console.log({ title: "Error19", message: e.message });
      }
    }
  };

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {
        let uri = image.assets[0].uri;
        let extension = image.assets[0].uri.split(".").pop();
        const fileName = Date.now() + "." + extension;

        //create new photo file and upload
        let picture = await fetch(uri);
        picture = await picture.blob();
        await uploadphoto(picture, fileName);
        if (profileVals.photo !== null || profileVals.photo === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: profileVals.photo.split("/").pop(),
          });
        }

        setProfileVals({
          ...profileVals,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateProfile({
          ...profileVals,
          photo: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  const onClose = () => {
    setLevelTwoScreen(false);
  };

  const openSettings = () => {
    setLevelTwoScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("SettingsScreen");
    useButtonPressHelper(
      "SettingsScreen",
      activeScreen,
      levelOneScreen,
      setLevelOneScreen
    );
  };

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={colors.themeWhite}
        onPress={() => onClose()}
        style={styles.backButton}
      />
      <View style={styles.settingsButton}>
        <MaterialIcons
          name="settings"
          size={moderateScale(46)}
          color={colors.themeWhite}
          onPress={openSettings}
        />
      </View>
      <View style={styles.addPhotoButton}>
        <MaterialIcons
          name="add-a-photo"
          size={moderateScale(30)}
          color={colors.themeWhite}
          onPress={() => handleImageUpload()}
        />
      </View>
      <View style={styles.contentContainer}>
        <View style={{ marginBottom: windowHeight / 70 }}>
          {profileVals && (
            <PlainTextInput
              content={profileVals.userName}
              fontSz={fontSizes.Header}
              isEditModeOn={isEditModeOn}
              setIsEditModeOn={setIsEditModeOn}
              onChangeText={(nameText) =>
                setProfileVals({ ...profileVals, userName: nameText })
              }
            />
          )}

          {userFail.length > 0 ? (
            <Text style={styles.erroMsg}>{userFail}</Text>
          ) : (
            <View style={styles.erroMsgEmpty}></View>
          )}
        </View>
        <MaskedView
          maskElement={
            <LinearGradient
              style={{ flex: 1 }}
              colors={["white", "transparent"]}
              start={{ x: 0.5, y: 0.7 }}
            ></LinearGradient>
          }
        >
          <View style={styles.scrollViewBox}>
            <ScrollView>
              {profileVals && (
                <PlainTextInput
                  content={profileVals.bio}
                  fontSz={fontSizes.StandardText}
                  isEditModeOn={isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  onChangeText={(bioText) =>
                    setProfileVals({ ...profileVals, bio: bioText })
                  }
                />
              )}
            </ScrollView>
          </View>
        </MaskedView>
      </View>

      <WavyHeaderDynamic
        customStyles={styles.svgCurve}
        image={profileVals && profileVals.photo}
      ></WavyHeaderDynamic>

      <BottomDrawer
        dataSet={[]}
        lowerBound={drawerLowerBound}
        upperBound={drawerUpperBound}
        drawerHeader={profile[0].UserName + screenData.UserProfile.drawerHeader}
        emptyDrawer={profile[0].UserName + screenData.UserProfile.emptyDrawer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight,
  },
  contentContainer: {
    alignItems: "left",
    zIndex: 15,
    position: "absolute",
    top: 0,
    left: 0,
    marginTop: Platform.OS === "ios" ? windowHeight / 2.4 : windowHeight / 2.2,
    width: "100%",
  },
  header: {
    zIndex: 10,
    marginTop:
      windowWidth > 600
        ? windowHeight / 2.5
        : moderateScale(windowHeight / 3.2),
    marginRight: windowWidth / 3,
    fontSize: moderateScale(34),
    fontFamily: activeFonts.Regular,
    color: colors.themeBlack,
  },
  scrollViewBox: {
    height: windowHeight / 4.5,
  },
  screenCloseButton: [
    { zIndex: 50, position: "absolute", top: "5%", right: "5%" },
  ],
  backButton: [{ zIndex: 50, position: "absolute", top: "5%", left: "2%" }],
  settingsButton: [
    { zIndex: 50, position: "absolute", top: "5%", right: "3%" },
  ],
  addPhotoButton: [
    { zIndex: 50, position: "absolute", top: "32%", right: "5%" },
  ],
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
  erroMsg: {
    minHeight: moderateScale(34),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
    marginHorizontal: "10%",
    marginTop: "1%",
  },
  erroMsgEmpty: {
    // height: moderateScale(34),
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Italic,
    color: "maroon",
    marginHorizontal: "10%",
    marginTop: "1%",
  },
});
