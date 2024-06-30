import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Platform,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  interpolateColor,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Share from "react-native-share";
import UserNamer from "../tutorial/usernamer";
import React, { useState, useContext, useEffect } from "react";
import * as FileSystem from "expo-file-system";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import {
  grabProfileById,
  getProfileWithStats,
} from "../../supabaseCalls/accountSupabaseCalls";
import { findImageInCache, cacheImage } from "../helpers/imageCashingHelper";
import InsetShadow from "react-native-inset-shadow";
import { scale, moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { ProfileModalContext } from "../contexts/profileModalContext";
import { SelectedProfileContext } from "../contexts/selectedProfileModalContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import ImgToBase64 from "react-native-image-base64";
import {
  insertUserFollow,
  deleteUserFollow,
  checkIfUserFollows,
} from "../../supabaseCalls/userFollowSupabaseCalls";
import InputFieldLg from "../reusables/textInputLarge";
import InputField from "../reusables/textInputs";
import ModalHeader from "../reusables/modalHeader";
import PrimaryButton from "../reusables/primaryButton";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function UserProfileModal() {
  const { profile, setProfile } = useContext(UserProfileContext);
  const [profileCloseState, setProfileCloseState] = useState(false);
  const [imaButState, setImaButState] = useState(false);
  const [nameButState, setNameButState] = useState(false);
  const [nameChangerState, setNameChangerState] = useState(false);
  const [followButState, setFollowButState] = useState(false);
  const [userFollows, setUserFollows] = useState(false);
  const [picUri, setPicUri] = useState(null);
  const { profileModal, setProfileModal } = useContext(ProfileModalContext);
  const [userStats, setUserStats] = useState(null);
  const { selectedProfile, setSelectedProfile } = useContext(
    SelectedProfileContext
  );
  const { setSiteModal } = useContext(AnchorModalContext);
  const [followData, setFollowData] = useState(profile[0].UserID);

  let fileName = `/Headliner.jpg`;
  let cacheDir = FileSystem.cacheDirectory + fileName;

  let image = {
    uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/LogoIcon.jpg`,
    // uri: `https://lsakqvscxozherlpunqx.supabase.co/storage/v1/object/public/animalphotos/public/Headliner.jpg`,
    id: fileName,
  };

  const callback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
  };

  const handleFollow = async (userName) => {
    // if (profile[0].UserID === picOwnerAccount[0].UserID){
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

  useEffect(() => {
    getProfile();

    async function followCheck() {
      let alreadyFollows = await checkIfUserFollows(
        profile[0].UserID,
        selectedProfile
      );
      if (alreadyFollows && alreadyFollows.length > 0) {
        setUserFollows(true);
        setFollowData(alreadyFollows[0].id);
      }
    }

    followCheck();
  }, []);

  const getProfile = async () => {
    let userID;
    if (selectedProfile) {
      userID = selectedProfile;
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

  const toggleProfileModal = () => {
    setProfileModal(false);
    // setUserStats(null);

    if (selectedProfile) {
      setSelectedProfile(null);
      setSiteModal(true);
    }
  };

  const [base64, setBase64] = useState(null);

  const convertBase64 = (cashed) => {
    ImgToBase64.getBase64String(cashed)
      .then((base64String) => {
        setBase64(base64String);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const doShare = async (shareOptions) => {
    try {
      const response = await Share.open(shareOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const onShare = async (photoFile) => {
    convertBase64(photoFile);
  };

  useEffect(() => {
    let localUri = `https://divegolanding.web.app`;

    const shareOptions = {
      message: "",
      url: "",
    };
    if (base64) {
      shareOptions.message = `Checkout Scuba SEAsons! \nA great app to help divers find the best place and time of year to dive with ANY sea creature!\nRight now they are looking for contributors to add their dive sites and sea creature photos!\n\nLearn more about it here: ${localUri}`;
      shareOptions.url = `data:image/jpg;base64,${base64}`;
      doShare(shareOptions);
    }
    setBase64(null);
  }, [base64]);

  const userBoxX = useSharedValue(scale(-450));

  const userBoxSlide = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: userBoxX.value }],
    };
  });

  const handleUserBox = () => {
    setNameChangerState(true);
  };

  useEffect(() => {
    console.log(nameChangerState);

    if (!nameChangerState) {
      userBoxX.value = withTiming(scale(-450));
      getProfile();
    } else {
      if (userBoxX.value === 0) {
        userBoxX.value = withTiming(scale(-450));
      } else {
        userBoxX.value = withSpring(scale(0));
      }
    }
  }, [nameChangerState]);

  let SeaLifeText, DiveSitesText, FollowersText, CommentsText, LikesText;

  if (userStats) {
    SeaLifeText = "Sea Life:  " + userStats[0].photocount;
    DiveSitesText = "Dive Sites:  " + userStats[0].divesitecount;
    FollowersText = "Followers:  " + userStats[0].followercount;
    CommentsText = "Comments:  " + userStats[0].commentcount;
    LikesText = "Likes:  " + userStats[0].likecount;
  }

  return (
    <View style={styles.container}>
      <ModalHeader
        titleText={
          userStats ? userStats[0].username + "'s Diving" : "My Diver Profile"
        }
        onClose={toggleProfileModal}
        icon={null}
        altButton={null}
      />
      <View style={styles.inputContainer}>
        {selectedProfile ? (
          <PrimaryButton
            buttonAction={handleFollow}
            label={
              userFollows
                ? "Following " + (userStats && userStats[0].username)
                : "Follow " + (userStats && userStats[0].username)
            }
            icon={null}
            followed={userFollows ? true : false}
          />
        ) : (
          <>
            <InputFieldLg
              placeHolderText={"Diver Name"}
              inputValue={userStats && userStats[0].username}
              keyboardType={"default"}
            />
            <InputFieldLg
              placeHolderText={"Email"}
              inputValue={userStats && userStats[0].email}
              keyboardType={"default"}
            />
          </>
        )}

        <View style={styles.statsContainer}>
          <InputField
            placeHolderText={"Sea Life"}
            inputValue={SeaLifeText}
            keyboardType={"default"}
          />
          <InputField
            placeHolderText={"Dive Sites"}
            inputValue={DiveSitesText}
            keyboardType={"default"}
          />
          <InputField
            placeHolderText={"Followers"}
            inputValue={FollowersText}
            keyboardType={"default"}
          />
          <InputField
            placeHolderText={"Comments"}
            inputValue={CommentsText}
            keyboardType={"default"}
          />
          <InputField
            placeHolderText={"Likes"}
            inputValue={LikesText}
            keyboardType={"default"}
          />
        </View>

        <View style={styles.buttonContainer}>
          <PrimaryButton
            buttonAction={handleUserBox}
            label={"Change Diver Name"}
            icon={null}
          />

          <PrimaryButton
            buttonAction={() => onShare(image.uri)}
            label={"Share Scuba SEAsons!"}
            icon={"share-square-o"}
          />
        </View>
      </View>

      <Animated.View style={[styles.userContainer, userBoxSlide]}>
        <UserNamer
          nameChangerState={nameChangerState}
          setNameChangerState={setNameChangerState}
          currentUserName={userStats && userStats[0].username}
        ></UserNamer>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#538bdb",
    // backgroundColor: 'green',
    marginBottom: "2%",
    width: "100%",
    marginLeft: 2,
    minHeight: Platform.OS === "android" ? 490 : 0,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(30),
  },
  labelBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: moderateScale(10),
    width: "40%",
    // backgroundColor: "pink"
  },
  labelText: {
    marginTop: moderateScale(10),
    marginLeft: moderateScale(10),
    marginRight: moderateScale(10),
    color: "white",
  },
  input: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "#538bdb",
    borderRadius: moderateScale(10),
    width: moderateScale(180),
    height: moderateScale(27),
    marginTop: scale(6),
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  inputRed: {
    fontFamily: "Itim_400Regular",
    backgroundColor: "pink",
    borderRadius: moderateScale(10),
    width: moderateScale(180),
    height: moderateScale(27),
    marginTop: scale(6),
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
    overflow: "scroll",
  },
  statsContainer: {
    // backgroundColor: "pink",
    marginTop: moderateScale(20),
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputSmall: {
    fontFamily: "Itim_400Regular",
    fontSize: moderateScale(16),
    color: "white",
  },
  ShareButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  ShareButtonPressed: {
    backgroundColor: "#538dbd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(40),
    height: moderateScale(40),
    width: moderateScale(200),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  FollowButton: {
    backgroundColor: "#538bdb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    height: moderateScale(40),
    marginTop: moderateScale(30),
    marginBottom: moderateScale(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
  FollowButtonPressed: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: moderateScale(10),
    marginBottom: moderateScale(10),
    height: moderateScale(40),
    marginTop: moderateScale(30),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6.27,

    elevation: 10,
  },
  userContainer: {
    position: "absolute",
    top: Platform.OS === "ios" ? "18%" : "18%",
    backgroundColor: "transparent",
    alignItems: "center",
    // marginTop: "-3%",
    height: "90%",
    marginRight: scale(10),
    marginLeft: scale(10),
    borderRadius: 15,
    // backgroundColor: "green"
  },
  buttonContainer: {
    flexDirection: "column-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    height: moderateScale(110),
    marginTop: moderateScale(15),
  },
});
