import { StyleSheet, View, Text, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import { scale, moderateScale } from "react-native-size-matters";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import ImageCasherDynamic from "../helpers/imageCashingDynamic";
import * as FileSystem from "expo-file-system";
import ImgToBase64 from "react-native-image-base64";
import email from "react-native-email";
import Share from "react-native-share";
import config from "../../config";

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
      <View style={styles.microLow}>
      <Text style={styles.microLow2}> Added by: {pic.userName}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    overflow: "hidden",
    // backgroundColor: "white",
    // borderTopRightRadius: scale(15),
    width: "100%",
    marginTop: scale(-15),
    marginBottom: scale(10)
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
    zIndex: 2
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
    zIndex: 2
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
    right: "3%",
    bottom: Platform.OS === "ios" ? "2%" : "2%",
    borderRadius: scale(5)
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
    zIndex: 2,
  },
});
