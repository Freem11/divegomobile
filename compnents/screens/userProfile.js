import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import WavyHeaderDynamic from "./wavyHeaderDynamic";
import PlainTextInput from "./plaintextInput";
import {
  activeFonts,
  colors,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
} from "../styles";
import screenData from "./screenData.json";
import { moderateScale, s } from "react-native-size-matters";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { SelectedProfileContext } from "../contexts/selectedProfileModalContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SessionContext } from "../contexts/sessionContext";
import { getPhotosByUserWithExtra } from "../../supabaseCalls/photoSupabaseCalls";
import { updateProfile } from "../../supabaseCalls/accountSupabaseCalls";
import { MaterialIcons } from "@expo/vector-icons";
import { registerForPushNotificationsAsync } from "../tutorial/notificationsRegistery";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import { chooseImageHandler } from "./imageUploadHelpers";
import BottomDrawer from "./animatedBottomDrawer";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";
import {
  insertUserFollow,
  deleteUserFollow,
  checkIfUserFollows,
} from "../../supabaseCalls/userFollowSupabaseCalls";
import { getProfileWithStats } from "../../supabaseCalls/accountSupabaseCalls";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UserProfile(props) {
  const {} = props;
  const { profile } = useContext(UserProfileContext);
  const { activeSession } = useContext(SessionContext);
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );
 
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
  const [visitProfileVals, setVisitProfileVals] = useState(null);
  const [tempUserName, setTempUserName] = useState("");
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState(null);
  const [followData, setFollowData] = useState(profile[0].UserID);
  const [userFollows, setUserFollows] = useState(false);
  const [userStats, setUserStats] = useState(null);

  const drawerUpperBound = "90%";
  const drawerLowerBound = "30%";

  const getPhotos = async () => {

    let success;
    if (selectedProfile && selectedProfile[0].UserID) {
      success = await getPhotosByUserWithExtra(
        selectedProfile[0].UserID,
        profile[0].UserID
      );
    } else {
      success = await getPhotosByUserWithExtra(
        profile[0].UserID,
        profile[0].UserID
      );
    }
    setProfilePhotos(success);
  };

  const getProfile = async () => {
    let userID;
    if (selectedProfile) {
      userID = selectedProfile[0].UserID;
    } else {
      userID = profile[0].UserID;
    }

    try {
      const success = await getProfileWithStats(userID);
      if (success) {
        setUserStats(success);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    getProfile();
    getPhotos();
  }, []);

  useEffect(() => {
    getProfile();
    getPhotos();
  }, [selectedProfile]);

  useEffect(() => {
    if (!selectedProfile|| selectedProfile[0].UserID === profile[0].UserID) {
    } else {
      setVisitProfileVals({
        id: selectedProfile[0].UserID,
        userName: selectedProfile[0].UserName,
        bio: selectedProfile[0].profileBio,
        photo: selectedProfile[0].profilePhoto,
      });
    }

    setProfileVals({
      id: profile[0].UserID,
      userName: profile[0].UserName,
      bio: profile[0].profileBio,
      photo: profile[0].profilePhoto,
    });
    setTempUserName(profile[0].UserName);

    async function followCheck() {
      let alreadyFollows = await checkIfUserFollows(
        profile[0].UserID,
        selectedProfile[0].UserID
      );
      if (alreadyFollows && alreadyFollows.length > 0) {
        setUserFollows(true);
        setFollowData(alreadyFollows[0].id);
      }
    }
if (selectedProfile){followCheck()}
  
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
    setVisitProfileVals(null);
    setSelectedProfile(null);
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


  const handleFollow = async () => {

    // let permissionGiven = await registerForPushNotificationsAsync(activeSession, "yes");
    // console.log("ERHEM", permissionGiven)
    // if (!permissionGiven) {
    //   return
    // }

    if (userFollows) {
      deleteUserFollow(followData);
      setUserFollows(false);
    } else {
      if (userStats) {
        let newRecord = await insertUserFollow(
          profile[0].UserID,
          userStats[0].userid
        );
        setFollowData(newRecord[0].id);
        setUserFollows(true);
      }
    }
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
      {visitProfileVals ? (
        <TouchableWithoutFeedback onPress={()=> handleFollow()}>
          <View style={styles.followButton}>
      <Text style={styles.followButtonText}>{userFollows ? screenData.UserProfile.userDoesFollow : screenData.UserProfile.UserDoesNotFollow}</Text>
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View style={styles.settingsButton}>
          <MaterialIcons
            name="settings"
            size={moderateScale(46)}
            color={colors.themeWhite}
            onPress={openSettings}
          />
        </View>
      )}
      {visitProfileVals ? null : (
        <View style={styles.addPhotoButton}>
          <MaterialIcons
            name="add-a-photo"
            size={moderateScale(30)}
            color={colors.themeWhite}
            onPress={() => handleImageUpload()}
          />
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.nameContainer}>
          {profileVals && (
            <PlainTextInput
              content={
                visitProfileVals
                  ? visitProfileVals.userName
                  : profileVals.userName
              }
              fontSz={fontSizes.Header}
              isEditModeOn={visitProfileVals ? false : isEditModeOn}
              setIsEditModeOn={setIsEditModeOn}
              visitor={visitProfileVals}
              onChangeText={(nameText) =>
                setProfileVals({ ...profileVals, userName: nameText })
              }
            />
          )}

          {userFail && userFail.length > 0 ? (
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
                  content={
                    visitProfileVals ? visitProfileVals.bio : profileVals.bio
                  }
                  fontSz={fontSizes.StandardText}
                  isEditModeOn={visitProfileVals ? false : isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  visitor={visitProfileVals}
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
        image={
          visitProfileVals
            ? visitProfileVals && visitProfileVals.photo
            : profileVals && profileVals.photo
        }
      ></WavyHeaderDynamic>

      <BottomDrawer
        dataSet={profilePhotos}
        dataSetType={"ProfilePhotos"}
        placeHolder={"Say a little about yourself"}
        setVisitProfileVals={setVisitProfileVals}
        lowerBound={drawerLowerBound}
        upperBound={drawerUpperBound}
        drawerHeader={
          (visitProfileVals ? visitProfileVals.userName : profile[0].UserName) +
          screenData.UserProfile.drawerHeader
        }
        emptyDrawer={
          (visitProfileVals ? visitProfileVals.userName : profile[0].UserName) +
          screenData.UserProfile.emptyDrawer
        }
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
  nameContainer: {
    // zIndex: 1,
    flexDirection: "row",
    width: "auto",
    marginTop: Platform.OS === "ios" ? windowHeight / 50 : windowHeight / 50,
    marginHorizontal: "0%",
  },
  header: {
    // zIndex: 50,
    marginTop: "5%",
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Regular,
    color: colors.themeBlack,
  },
  scrollViewBox: {
    height: windowHeight / 4.5,
  },
  screenCloseButton: [
    { zIndex: 10, position: "absolute", top: "5%", right: "5%" },
  ],
  backButton: [{ zIndex: 50, position: "absolute", top: "5%", left: "2%" }],
  settingsButton: [
    { zIndex: 10, position: "absolute", top: "5%", right: "3%" },
  ],
  addPhotoButton: [
    { zIndex: 10, position: "absolute", top: "32%", right: "5%" },
  ],
  followButton: [
    { zIndex: 10, position: "absolute", top: "6%", right: "3%" },
    screenSecondaryButton,
  ],
  followButtonText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
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
