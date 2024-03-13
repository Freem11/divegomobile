import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { scale, moderateScale } from "react-native-size-matters";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  insertPhotoLike,
  deletePhotoLike,
  grabPhotoLikeById,
  countPhotoLikeById,
} from "../../supabaseCalls/photoLikeSupabaseCalls";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { CommentsModalContext } from "../contexts/commentsModalContext";
import { SelectedPictureContext } from "../contexts/selectedPictureContext";
import ImageCasherDynamic from "../helpers/imageCashingDynamic";
import * as FileSystem from "expo-file-system";
import ImgToBase64 from "react-native-image-base64";
import email from "react-native-email";
import Share from "react-native-share";
import config from "../../config";
import notLiked from "../png/Hand-Hollow-Blue.png";
import liked from "../png/Hand-Filled-Blue.png";
import bubbles from "../png/bubbles.png";

export default function Picture(props) {
  const { pic } = props;

  const handleEmail = (pic) => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with picture: "${pic.label}" - ${pic.photoFile} `,
      body:
        "Type of issue: \n \n 1) Animal name not correct \n (Please provide the correct animal name and we will correct the record)\n \n 2)Copy write image claim \n (Please provide proof that you own the submitted photo and we will remove it as you have requested)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [base64, setBase64] = useState(null);
  const [userN, setUserN] = useState(null);
  const [creastureN, setCreastureN] = useState(null);
  const [photoDate, setPhotoDate] = useState(null);
  const [mapLocal, setMapLocal] = useState(null);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { profile } = useContext(UserProfileContext);
  const { setCommentsModal } = useContext(CommentsModalContext);
  const { setSelectedPicture } = useContext(SelectedPictureContext);

  const [picLiked, setPicLiked] = useState(false);
  const [likeData, setLikeData] = useState(null);
  const [countOfLikes, setCountOfLikes] = useState(0);

  const handleCommentModal = () => {
    console.log("wtf");
    setCommentsModal(true);
    setSelectedPicture(pic);
  };

  const handleLike = async (picId) => {
    if (picLiked) {
      deletePhotoLike(likeData[0].id);
      setPicLiked(false);
      setCountOfLikes(countOfLikes - 1);
    } else {
      let newRecord = await insertPhotoLike(profile[0].UserID, pic.id);
      setPicLiked(true);
      setLikeData(newRecord);
      setCountOfLikes(countOfLikes + 1);
    }
  };

  useEffect(() => {
    getLikeStatus(profile[0].UserID, pic.id);
    getLikeCount(pic.id);
  }, []);

  const getLikeStatus = async (userID, PicID) => {
    try {
      const likeStatus = await grabPhotoLikeById(userID, PicID);
      setLikeData(likeStatus);
      if (likeStatus.length > 0) {
        setPicLiked(true);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  const getLikeCount = async (PicID) => {
    try {
      const likeCount = await countPhotoLikeById(PicID);
      if (!likeCount) {
        setCountOfLikes(0);
      } else {
        setCountOfLikes(likeCount);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
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

  const onShare = async (photoFile, userN, seaCreature, picDate, lat, lng) => {
    let local = await getPhotoLocation(lat, lng);
    setMapLocal(local);
    setCreastureN(seaCreature);
    setPhotoDate(picDate);
    if (userN) {
      setUserN(userN);
    } else {
      setUserN("an unnamed diver");
    }

    let temp = photoFile.split("/");
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
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${Lat},${Lng}&key=${config.GOOGLE_MAPS_API_KEY}`
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
      shareOptions.message = `Checkout this cool pic of a ${creastureN} on Scuba SEAsons! It was taken by ${userN} at the dive site: ${selectedDiveSite.SiteName}, in${mapLocal} on ${photoDate}.\nMaybe we should start contributing out pics as well!\n\nLearn more about it here:\n${localUri}`;
      shareOptions.url = `data:image/jpg;base64,${base64}`;
      doShare(shareOptions);
    }
    setBase64(null);
  }, [base64]);

  return (
    <View style={styles.outterBox}>
      <View style={styles.container}>
        <View style={styles.micro}>
          <FontAwesome
            name="share"
            color="white"
            size={scale(19)}
            onPress={() =>
              onShare(
                pic.photoFile,
                pic.userName,
                pic.label,
                pic.dateTaken,
                pic.latitude,
                pic.longitude
              )
            }
            style={styles.share}
          />
          <FontAwesome
            name="flag"
            color="maroon"
            size={scale(19)}
            onPress={() => handleEmail(pic)}
            style={styles.flag}
          />
          <Text style={styles.titleText}>{pic.label}</Text>
        </View>

        <ImageCasherDynamic
          photoFile={pic.photoFile}
          id={pic.id}
          style={{
            borderRadius: 15,
            resizeMode: "cover",
            // backgroundColor: "pink",
          }}
        />
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
          <Text style={styles.microLow2}> Added by: {pic.userName}</Text>
        </View>
      </View>
      <TouchableWithoutFeedback
        onPress={() => handleCommentModal(pic)}>
        <View
         onPress={() => handleCommentModal(pic)}
          style={{
            flexDirection: "row",
            marginLeft: moderateScale(20),
            zIndex: 4,
          }}
        >
          <Text style={styles.commentPrompt} onPress={() => handleCommentModal(pic)}> Be first to Comment</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  outterBox: {
    width: "100%",
    marginLeft: moderateScale(-10),
  },
  container: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
    // backgroundColor: "white",
    // borderTopRightRadius: scale(15),
    width: "100%",
    marginTop: scale(-15),
    marginBottom: scale(10),
  },
  titleText: {
    // textAlign: "center",
    alignItems: "flex-start",
    alignContent: "flex-start",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    width: "77%",
    fontSize: scale(15),
    marginLeft: scale(-30),
  },
  share: {
    left: scale(232),
    top: scale(1),
    opacity: 0.8,
    zIndex: 2,
  },
  micro: {
    flex: 1,
    flexDirection: "row",
    // position: "relative",
    backgroundColor: "black",
    opacity: 0.6,
    width: "120%",
    borderRadius: 5,
    zIndex: 2,
    left: scale(8),
    top: Platform.OS === "ios" ? "8%" : "9%",
  },
  flag: {
    left: scale(237),
    top: scale(1),
    zIndex: 2,
  },
  likeIcon: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 4,
    right: "2%",
    bottom: Platform.OS === "ios" ? "1.5%" : "1.5%",
    borderRadius: scale(5),
  },
  countIndicator: {
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    position: "absolute",
    zIndex: 4,
    right: moderateScale(30),
    backgroundColor: "black",
    width: "10%",
    height: moderateScale(18),
    paddingLeft: scale(5),
    opacity: 0.6,
    bottom: Platform.OS === "ios" ? "2%" : "2%",
    borderTopLeftRadius: scale(5),
    borderBottomLeftRadius: scale(5),
  },
  countDisplay: {
    color: "white",
    fontSize: scale(8),
    fontFamily: "Itim_400Regular",
  },
  microLow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "black",
    height: moderateScale(18),
    opacity: 0.6,
    color: "white",
    fontFamily: "Itim_400Regular",
    padding: 1,
    paddingLeft: scale(6),
    paddingRight: scale(7),
    zIndex: 2,
    left: "2%",
    bottom: Platform.OS === "ios" ? "2%" : "2%",
    borderRadius: scale(5),
  },
  microLow2: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    opacity: 1,
    color: "white",
    fontFamily: "Itim_400Regular",
    fontSize: scale(8),
    zIndex: 2,
  },
  commentPrompt: {
    display: "flex",
    width: moderateScale(150),
    height: scale(20),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    opacity: 1,
    color: "white",
    // backgroundColor: "black",
    fontFamily: "Itim_400Regular",
    fontSize: scale(10),
    zIndex: 4,
    paddingLeft: moderateScale(10),
    paddingRight: moderateScale(2),
    marginTop: moderateScale(0),
    marginBottom: moderateScale(10),
    marginLeft: moderateScale(0),
  },
});
