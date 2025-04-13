import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { scale, moderateScale } from "react-native-size-matters";
import { activeFonts, colors, fontSizes } from "../styles";
import { FontAwesome } from "@expo/vector-icons";
import {
  insertPhotoLike,
  deletePhotoLike,
} from "../../supabaseCalls/photoLikeSupabaseCalls";
import { grabProfileByUserName } from "../../supabaseCalls/accountSupabaseCalls";
import { useButtonPressHelper } from "../FABMenu/buttonPressHelper";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedPictureContext } from "../contexts/selectedPictureContext";
import { SelectedProfileContext } from "../contexts/selectedProfileModalContext";
import ImageCasherDynamic from "../helpers/imageCashingDynamic";
import * as FileSystem from "expo-file-system";
import ImgToBase64 from "react-native-image-base64";
import email from "react-native-email";
import Share from "react-native-share";
import * as Sharing from "expo-sharing";
import notLiked from "../png/socialIcons/Hand-Hollow-Blue.png";
import liked from "../png/socialIcons/Hand-Filled-Blue.png";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../contexts/levelTwoScreenContext";
import { ActiveScreenContext } from "../contexts/activeScreenContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";

let GoogleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const windowWidth = Dimensions.get("window").width;

export default function Picture(props) {
  const { pic, dataSetType, diveSiteName, setVisitProfileVals } = props;
  const { setLevelOneScreen } = useContext(LevelOneScreenContext);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { setSelectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);

  const handleEmail = (pic) => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with picture: "${pic.label}" - ${pic.photofile} `,
      body:
        "Type of issue: \n \n 1) Animal name not correct \n (Please provide the correct animal name and we will correct the record)\n \n 2)Copy write image claim \n (Please provide proof that you own the submitted photo and we will remove it as you have requested)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };



  const [base64, setBase64] = useState(null);
  const [userN, setUserN] = useState(null);
  const [creastureN, setCreastureN] = useState(null);
  const [photoDate, setPhotoDate] = useState(null);
  const [mapLocal, setMapLocal] = useState(null);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { profile } = useContext(UserProfileContext);
  const { setSelectedPicture } = useContext(SelectedPictureContext);
  const { setSelectedProfile } = useContext(SelectedProfileContext);
  const [picLiked, setPicLiked] = useState(pic.likedbyuser);
  const [likeData, setLikeData] = useState(pic.likeid);
  const [countOfLikes, setCountOfLikes] = useState(pic.likecount);

  const handleCommentModal = (pic) => {
    // setCommentsModal(true);
    setFullScreenModal(true);
    setActiveTutorialID("CommentsModal");
    setSelectedPicture(pic);
  };

  const handleLike = async () => {
    if (picLiked) {
      deletePhotoLike(likeData);
      setPicLiked(false);
      setCountOfLikes(countOfLikes - 1);
    } else {
      let newRecord = await insertPhotoLike(profile[0].UserID, pic.id);
      setPicLiked(true);
      setLikeData(newRecord[0].id);
      setCountOfLikes(countOfLikes + 1);
    }
  };

  const handleFollow = async (userName) => {
    let picOwnerAccount = await grabProfileByUserName(userName);

    if (profile[0].UserID === picOwnerAccount[0].UserID) {
      return;
    }

    setSelectedProfile(picOwnerAccount);
    setLevelOneScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("ProfileScreen");
    useButtonPressHelper(
      "ProfileScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };

  const handleDiveSiteMove = async (pic) => {
    setSelectedDiveSite({
      SiteName: diveSiteName,
      Latitude: pic.latitude,
      Longitude: pic.longitude,
    });
    setVisitProfileVals(null);
    setSelectedProfile(null);
    setLevelTwoScreen(false);
  };

  const convertBase64 = (cacheDir) => {
    ImgToBase64.getBase64String(cacheDir)
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

    setUserN(null);
    setCreastureN(null);
    setPhotoDate(null);
    setMapLocal(null);
  };

  const onShare = async (photofile, userN, seaCreature, picDate, lat, lng) => {
    let local = await getPhotoLocation(lat, lng);

    setMapLocal(local);
    setCreastureN(seaCreature);
    setPhotoDate(picDate);
    if (userN) {
      setUserN(userN);
    } else {
      setUserN("an unnamed diver");
    }
    let temp = photofile.split("/");
    let lastIndex = temp.length - 1;
    let fileName = temp[lastIndex];
    let cacheDir = FileSystem.cacheDirectory + fileName;
    convertBase64(cacheDir);
  };

  async function getPhotoLocation(photoLat, photoLng) {
    let Lat = Number(photoLat);
    let Lng = Number(photoLng);

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Lat},${Lng}&key=${GoogleMapsApiKey}`
      );
      const placeInfo = await res.json();
      let genAddress = placeInfo.results[1].formatted_address;
      let fudgedAddress = genAddress.split(",");
      let bits = [
        fudgedAddress[fudgedAddress.length - 2],
        fudgedAddress[fudgedAddress.length - 1],
      ].join();
      return bits;
    } catch (err) {
      console.log("error", err);
    }
  }

  useEffect(() => {
    let localUri = `https://divegolanding.web.app`;

    const shareOptions = {
      message: "",
      url: "",
    };
    if (base64) {
      shareOptions.message = `Checkout this cool pic of a ${creastureN} on Scuba SEAsons! It was taken by ${userN} at the dive site: ${selectedDiveSite.SiteName}, in${mapLocal} on ${photoDate}.\nMaybe we should start contributing our pics as well!\n\nLearn more about it here:\n${localUri}`;
      shareOptions.url = `data:image/jpg;base64,${base64}`;
      doShare(shareOptions);
    }
    setBase64(null);
  }, [base64]);

  const togglePhotoBoxModal = (photo) => {
    setSelectedPhoto(photo);
    setFullScreenModal(true);
    setActiveTutorialID("PinchAndZoomPhoto");
  };

  return (
    <View key={pic.id} style={styles.outterBox}>
      <View style={styles.container}>
        <View style={styles.micro}>
          <Text style={styles.titleText}>{pic.label}</Text>
          <FontAwesome
            name="share"
            color="white"
            size={scale(19)}
            onPress={() => {
              return onShare(
                pic.photoFile,
                pic.UserName,
                pic.label,
                pic.dateTaken,
                pic.latitude,
                pic.longitude
              );
            }}
            style={styles.share}
          />
          <FontAwesome
            name="flag"
            color="maroon"
            size={scale(19)}
            onPress={() => handleEmail(pic)}
            style={styles.flag}
          />
        </View>
        <ImageCasherDynamic
          photoFile={pic.photoFile}
          id={pic.id}
          style={{
            borderRadius: moderateScale(15),
            resizeMode: "cover",
            marginTop: moderateScale(-22),
            // backgroundColor: "pink",
          }}
        />
        <View
          style={{ width: "100%", position: "absolute", bottom: 10, left: 7 }}
        >
          {countOfLikes > 0 ? (
            <View style={styles.countIndicator}>
              <Text style={styles.countDisplay}>{countOfLikes}</Text>
            </View>
          ) : null}
          <TouchableWithoutFeedback onPress={() => handleLike(pic.id)}>
            <Image
              source={picLiked ? liked : notLiked}
              style={[
                styles.likeIcon,
                {
                  height: moderateScale(30),
                  width: moderateScale(30),
                },
              ]}
            />
          </TouchableWithoutFeedback>

          <View style={styles.microLow}>
            {dataSetType === "ProfilePhotos" ? (
              <Text
                style={styles.microLow2}
                onPress={() => handleDiveSiteMove(pic)}
              >
                {" "}
                Go to this location!
              </Text>
            ) : (
              <Text
                style={styles.microLow2}
                onPress={() => handleFollow(pic.UserName)}
              >
                {" "}
                Added by: {pic.UserName}
              </Text>
            )}
          </View>
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={() => handleCommentModal(pic)}
        style={{ height: moderateScale(30), backgroundColor: "pink" }}
      >
        <View
          // onPress={() => handleCommentModal(pic)}
          style={{
            flexDirection: "row",
            marginLeft: moderateScale(20),
            zIndex: 10,
            height: moderateScale(25),
            width: "80%",
            borderRadius: moderateScale(10),
            paddingBottom: moderateScale(5),
            marginTop: moderateScale(5),
            // backgroundColor: 'pink'
          }}
        >
          <Text style={styles.commentPrompt}>
            {pic.commentcount < 1
              ? "Be first to Comment"
              : `Comment / View all ${pic.commentcount} Comments`}{" "}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  outterBox: {
    zIndex: 70,
    width: windowWidth,
    marginBottom: moderateScale(5),
  },
  container: {
    zIndex: 40,
    borderTopRightRadius: scale(10),
    width: windowWidth,
    marginLeft: "0.25%",
    padding: moderateScale(2),
  },
  titleText: {
    fontFamily: activeFonts.Light,
    color: colors.themeWhite,
    width: "77%",
    fontSize: moderateScale(fontSizes.StandardText),
  },
  share: {
    opacity: 0.8,
    zIndex: 2,
  },
  micro: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: colors.themeBlack,
    opacity: 0.7,
    width: "96%",
    top: windowWidth > 600 ? "3%" : "2%",
    marginLeft: "2%",
    borderRadius: 5,
    zIndex: 2,
  },
  flag: {
    zIndex: 2,
  },
  likeIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 4,
    right: "2%",
    bottom: Platform.OS === "ios" ? "10%" : "10%",
    borderRadius: scale(5),
  },
  countIndicator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    position: "absolute",
    zIndex: 4,
    right: moderateScale(30),
    backgroundColor: colors.themeBlack,
    width: "10%",
    height: moderateScale(18),
    paddingLeft: scale(5),
    opacity: 0.7,
    bottom: Platform.OS === "ios" ? "3%" : "3%",
    borderTopLeftRadius: scale(5),
    borderBottomLeftRadius: scale(5),
  },
  countDisplay: {
    color: colors.themeWhite,
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Bold,
  },
  microLow: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    backgroundColor: colors.primaryBlue,
    color: colors.themeWhite,
    fontFamily: activeFonts.Light,
    paddingHorizontal: moderateScale(10),
    paddingVertical: moderateScale(3),
    zIndex: 2,
    left: "1%",
    bottom: Platform.OS === "ios" ? "3%" : "3%",
    borderRadius: scale(8),
  },
  microLow2: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    opacity: 1,
    color: colors.themeWhite,
    fontFamily: activeFonts.Light,
    fontSize: moderateScale(fontSizes.SmallText),
    zIndex: 2,
  },
  commentPrompt: {
    display: "flex",
    width: scale(200),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    opacity: 1,
    color: colors.themeBlack,
    fontFamily: activeFonts.Thin,
    fontSize: moderateScale(fontSizes.SmallText),
    zIndex: 10,
    paddingTop: moderateScale(5),
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(2),
  },
});
