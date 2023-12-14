import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Dimensions,
  Linking,
} from "react-native";
import Share from "react-native-share";
import React, { useState, useContext, useEffect } from "react";
import {
  getPhotosforAnchor,
  getPhotosforAnchorMulti,
} from "../../supabaseCalls/photoSupabaseCalls";
import { getDiveSiteByName } from "../../supabaseCalls/diveSiteSupabaseCalls";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import { SliderContext } from "../contexts/sliderContext";
import { MonthSelectContext } from "../contexts/monthSelectContext";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnimalSelectContext } from "../contexts/animalSelectContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { TutorialModelContext } from "../contexts/tutorialModalContext";
import { AnchorModalContext } from "../contexts/anchorModalContext";
import { ChapterContext } from "../contexts/chapterContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { TutorialContext } from "../contexts/tutorialContext";
import { ReverseContext } from "../contexts/reverseContext";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { scale } from "react-native-size-matters";
import { FontAwesome } from "@expo/vector-icons";
import email from "react-native-email";
import PhotoBoxModel from "./photoBoxModal";
import ImageCasher from "../helpers/imageCashing";
import ImgToBase64 from "react-native-image-base64";
import config from "../../config";

let IPSetter = 2;
let IP;
//Desktop = 10.0.0.253
//Laptop = 10.0.0.68
//Library = 10.44.22.110

if (IPSetter === 1) {
  IP = "10.0.0.253";
} else if (IPSetter === 2) {
  IP = "10.0.0.68";
} else if (IPSetter === 3) {
  IP = "10.44.22.110";
}

let filePath = `/Users/matthewfreeman/divego/wetmap/src/components/uploads/`;

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function AnchorModal(lat, lng) {
  const { sliderVal } = useContext(SliderContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [anchorPics, setAnchorPics] = useState([]);
  const { monthVal } = useContext(MonthSelectContext);
  const { animalSelection } = useContext(AnimalSelectContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
  const { movingBack, setMovingBack } = useContext(ReverseContext);
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  const [siteCloseState, setSiteCloseState] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [site, setSite] = useState("");
  const [photoBoxModel, setPhotoBoxModel] = useState(false);

  const photoBoxModalY = useSharedValue(windowHeight);

  const photoBoxModalReveal = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: photoBoxModalY.value }],
    };
  });

  const startPhotoBoxModalAnimations = () => {
    if (photoBoxModel) {
      photoBoxModalY.value = withTiming(0);
    } else {
      photoBoxModalY.value = withTiming(windowHeight);
    }
  };

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      const photos = await getPhotosforAnchorMulti({
        animalMultiSelection,
        // sliderVal,
        minLat,
        maxLat,
        minLng,
        maxLng,
      });
      if (photos) {
        setAnchorPics(photos);
        let count = 0;
        photos.forEach((obj) => {
          count++;
        });

        if (chapter === null){
          if(itterator !== 20){
            if (tutorialRunning && count > 0 ) {
              setItterator(itterator + 2);
            } else if (tutorialRunning) {
              setItterator(itterator + 1);
            }
          }
        } else {
          if (tutorialRunning && count > 0 ) {
            setItterator(itterator + 2);
          } else if (tutorialRunning) {
            setItterator(itterator + 1);
          }
        }
      
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    getDiveSite(selectedDiveSite.SiteName);
    filterAnchorPhotos();
  }, [selectedDiveSite]);

  useEffect(() => {
    if (itterator === 13) {
      setGuideModal(true);
    }
    if (itterator === 20) {
      filterAnchorPhotos();
    }
  }, [itterator]);

  const getDiveSite = async (site) => {
    try {
      const selectedSite = await getDiveSiteByName(site);
      if (selectedSite.length > 0) {
        setSite(selectedSite[0].userName);
      }
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

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

  const handleEmailDS = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with Dive Site: "${lat.SiteName}" at Latitude: ${lat.Lat} Longitude: ${lat.Lng} `,
      body:
        "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordiantes are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const handleAnchorModalClose = () => {
    if (itterator === 15) {
      setItterator((prev) => prev + 1)
      setGuideModal(true);
    }

    if (itterator === 11) {
      setGuideModal(false);
    }

    if (itterator === 18) {
      // setItterator((prev) => prev + 1)
      setGuideModal(false);
    }

    setSiteModal(false);
  };

  const togglePhotoBoxModal = (photo) => {
    startPhotoBoxModalAnimations();
    setSelectedPhoto(photo);
    setPhotoBoxModel(!photoBoxModel);
  };

  const [base64, setBase64] = useState(null);
  const [userN, setUserN] = useState(null);
  const [creastureN, setCreastureN] = useState(null);
  const [photoDate, setPhotoDate] = useState(null);
  const [mapLocal, setMapLocal] = useState(null);

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
    <View
      style={{
        height: "96%",
      }}
    >
      <View style={styles.titleAlt}>
        <FontAwesome
          name="flag"
          color="maroon"
          size={scale(20)}
          onLongPress={() => handleEmailDS()}
          style={styles.flagMajor}
        />
        <View style={{ width: scale(250) }}>
          <Text style={styles.headerAlt}>{selectedDiveSite.SiteName}</Text>
          <Text style={styles.dsCredit}>Added by: {site}</Text>
        </View>

        <TouchableWithoutFeedback
          onPress={handleAnchorModalClose}
          onPressIn={() => setSiteCloseState(true)}
          onPressOut={() => setSiteCloseState(false)}
        >
          <View
            style={
              siteCloseState
                ? styles.closeButtonAltPressed
                : styles.closeButtonAlt
            }
          >
            <FontAwesome name="close" color="#BD9F9F" size={scale(28)} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <ScrollView style={{ marginTop: "0%", height: "100%", borderRadius: 15 }}>
        <View style={styles.container3}>
          {anchorPics &&
            anchorPics.map((pic) => {
              return (
                <View key={pic.id} style={styles.picContainer3}>
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
                      onLongPress={() => handleEmail(pic)}
                      style={styles.flag}
                    />
                    <Text style={styles.titleText}>{pic.label}</Text>
                  </View>
                  <TouchableWithoutFeedback
                    onPress={() => togglePhotoBoxModal(pic.photoFile)}
                  >
                    <View style={styles.shadowbox}>
                      <ImageCasher
                        photoFile={pic.photoFile}
                        id={pic.id}
                        anchorPics={anchorPics}
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 15,
                          borderColor: "grey",
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                  <View style={styles.microLow}>
                    <Text style={styles.titleTextLow}>
                      Added by: {pic.userName}
                    </Text>
                  </View>
                </View>
              );
            })}
          {anchorPics.length === 0 && (
            <Text style={styles.noSightings}>
              No Sightings At This Site Yet!
            </Text>
          )}
        </View>
      </ScrollView>

      <Animated.View style={[styles.photoBoxModal, photoBoxModalReveal]}>
        <PhotoBoxModel
          picData={selectedPhoto}
          togglePhotoBoxModal={togglePhotoBoxModal}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container3: {
    // flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    marginTop: "-3%",
    height: "100%",
    marginRight: scale(10),
    marginLeft: scale(10),
    marginBottom: scale(16),
    borderRadius: 15,
    // backgroundColor: "green"
  },
  picContainer3: {
    width: scale(300),
    height: scale(200),
    marginBottom: scale(5),
    backgroundColor: "538bdb",
    marginTop: "-0%",
    borderRadius: 15,
  },
  shadowbox: {
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.8,
    shadowRadius: 5,

    elevation: 10,
  },
  titleText: {
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(15),
    marginLeft: scale(-27),
  },
  flagMajor: {
    width: "10%",
    height: scale(30),
    marginRight: "-5%",
    // backgroundColor: 'blue'
  },
  share: {
    left: scale(232),
    top: scale(1),
    opacity: 0.8,
  },
  flag: {
    left: scale(237),
    top: scale(1),
  },
  noSightings: {
    flex: 1,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: "40%",
    fontFamily: "Itim_400Regular",
    fontSize: scale(18),
    color: "#F0EEEB",
    // backgroundColor: "green"
  },
  micro: {
    display: "flex",
    flexDirection: "row",
    position: "relative",
    backgroundColor: "black",
    opacity: 0.6,
    width: "94%",
    borderRadius: 5,
    zIndex: 2,
    left: "4%",
    top: Platform.OS === "ios" ? "8%" : "9%",
  },
  microLow: {
    display: "flex",
    flexDirection: "row",
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.6,
    // width: "54%",
    borderRadius: 5,
    zIndex: 2,
    right: "3%",
    bottom: Platform.OS === "ios" ? "-7%" : "-7%",
  },
  titleTextLow: {
    textAlign: "center",
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(10),
    paddingLeft: scale(5),
    paddingRight: scale(7),
  },
  flagger: {
    height: scale(30),
    width: "10%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    // backgroundColor: 'green'
    // flexDirection: "row",
    // position: "absolute",
    // top: Platform.OS === "ios" ? "-7%" :"-1.5%",
    // left: Platform.OS === "ios" ? "-8%" :"-5%",
  },
  headerAlt: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: scale(22),
    width: "90%",
    height: "120%",
    marginLeft: "5%",
    marginRight: "5%",
    marginTop: 0,
    marginBottom: -10,
    flexWrap: "wrap",
    // backgroundColor: "pink"
  },
  dsCredit: {
    // backgroundColor: 'pink',
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(9),
    width: scale(200),
    marginLeft: scale(12),
  },
  titleAlt: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "4%",
    marginLeft: "5%",
    marginRight: "5%",
    marginBottom: "3%",
    width: "92%",
    height: scale(30),
    // backgroundColor: 'pink'
  },
  closeButtonAlt: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "-4%",
    // backgroundColor: "green"
  },
  closeButtonAltPressed: {
    position: "relative",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: scale(30),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "-4%",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  photoBoxModal: {
    position: "absolute",
    height: windowHeight,
    width: windowWidth,
    zIndex: 55,
    left: 0,
    backgroundColor: "green",
  },
});
