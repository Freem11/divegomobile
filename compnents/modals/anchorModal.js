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
  getPhotosWithUser,
  getPhotosWithUserEmpty
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
import { MyCreaturesContext } from "../contexts/myCreaturesContext";
import { PinContext } from "../contexts/staticPinContext";
import { PictureAdderContext } from "../contexts/picModalContext";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { scale } from "react-native-size-matters";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import email from "react-native-email";
import ImageCasher from "../helpers/imageCashing";
import ImgToBase64 from "react-native-image-base64";
import config from "../../config";
import Picture from "./picture";

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

export default function AnchorModal(props) {
  const {lat, lng, setSelectedPhoto, setPhotoBoxModel } = props
  const { sliderVal } = useContext(SliderContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [anchorPics, setAnchorPics] = useState([]);
  const { monthVal } = useContext(MonthSelectContext);
  const { animalSelection } = useContext(AnimalSelectContext);
  const { myCreatures, setMyCreatures } = useContext(MyCreaturesContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const { tutorialRunning, setTutorialRunning } = useContext(TutorialContext);
  const { chapter, setChapter } = useContext(ChapterContext);
  const { movingBack, setMovingBack } = useContext(ReverseContext);
  const { guideModal, setGuideModal } = useContext(TutorialModelContext);
  const { siteModal, setSiteModal } = useContext(AnchorModalContext);
  const [siteCloseState, setSiteCloseState] = useState(false);
  const [site, setSite] = useState("");
  const { pinValues, setPinValues } = useContext(PinContext);
  const { picAdderModal, setPicAdderModal } = useContext(PictureAdderContext);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      let photos;
      if(animalMultiSelection.length === 0){
         photos = await getPhotosWithUserEmpty({
          myCreatures,
          minLat,
          maxLat,
          minLng,
          maxLng,
        })
      } else {
         photos = await getPhotosWithUser({
          animalMultiSelection,
          myCreatures,
          minLat,
          maxLat,
          minLng,
          maxLng,
        })
      }
      if (photos) {
        setAnchorPics(photos);
        let count = 0;
        photos.forEach((obj) => {
          count++;
        });

        if (itterator === 11 && count > 0) {
          setItterator(itterator + 2);
        }

        // if (chapter === null){
        //   if(itterator !== 20){
        //     if (tutorialRunning && count > 0 ) {
        //       setItterator(itterator + 2);
        //     } else if (tutorialRunning) {
        //       setItterator(itterator + 1);
        //     }
        //   }
        // } else {
        //   if (tutorialRunning && count > 0 ) {
        //     setItterator(itterator + 2);
        //   } else if (tutorialRunning) {
        //     setItterator(itterator + 1);
        //   }
        // }
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
      subject: `Reporting issue with Dive Site: "${selectedDiveSite.SiteName}" at Latitude: ${selectedDiveSite.Latitude} Longitude: ${selectedDiveSite.Longitude} `,
      body:
        "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordinates are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const handleAnchorModalClose = () => {
    if (itterator === 15) {
      setItterator((prev) => prev + 1);
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

  const handleSwitch = () => {
    if (itterator === 11 || itterator == 15){
      return
    }
    setPinValues({
      ...pinValues,
      Latitude: String(selectedDiveSite.Latitude),
      Longitude: String(selectedDiveSite.Longitude),
    });
    setSiteModal(false);
    setPicAdderModal(true);
  }

  const togglePhotoBoxModal = (photo) => {
    setSelectedPhoto(photo);
    setPhotoBoxModel(true);
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

  const [helpButState, setHelpButState] = useState(false);

  return (
    <View
      style={{
        height: "98%",
        // backgroundColor: "orange",
        overflow: "hidden"
      }}
    >
      <View style={styles.titleAlt}>
        <FontAwesome
          name="flag"
          color="maroon"
          size={scale(20)}
          onPress={() => handleEmailDS()}
          style={styles.flagMajor}
        />
        <View style={{ width: scale(250) }}>
          <Text style={styles.headerAlt}>{selectedDiveSite.SiteName}</Text>
          <Text style={styles.dsCredit}>Added by: {site}</Text>
        </View>
        <View
          style={helpButState ? styles.helpButtonPressed : styles.helpButton}
        >
          <TouchableWithoutFeedback
            onPress={handleSwitch}
            onPressIn={() => setHelpButState(true)}
            onPressOut={() => setHelpButState(false)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              width: scale(20),
              height: scale(20),
            }}
          >
            <FontAwesome5
              name="plus"
              color="gold"
              size={scale(18)}
              style={{ zIndex: -1 }}
            />
          </TouchableWithoutFeedback>
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

      <ScrollView style={{ marginTop: "0%", width: "100%", borderRadius: 15 }}>
        <View style={styles.container3}>
          {anchorPics &&
            anchorPics.map((pic) => {
              return (
                <TouchableWithoutFeedback key={pic.id} onPress={() => togglePhotoBoxModal(pic.photofile)}>
                <View style={styles.shadowbox}>
                <Picture key={pic.id} pic={pic}></Picture>
                </View>
                </TouchableWithoutFeedback>
              );
            })}
          {anchorPics.length === 0 && (
            <View>
              <Text style={styles.noSightings}>
                No Sightings At This Site Yet!
              </Text>
              <Text style={styles.noSightings2}>
                Be the first to add one here.
              </Text>

              <TouchableWithoutFeedback
                onPress={() => handleSwitch()}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: scale(32),
                  height: scale(32),
                  borderRadius: scale(32),
                  backgroundColor: "black"
                }}
              >
                <View
                  style={{
                    borderRadius: scale(32),
                    backgroundColor: "palegreen",
                    width: scale(38),
                    height: scale(38),
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome5 name="plus" color={"black"} size={scale(32)} />
                </View>
              </TouchableWithoutFeedback>
            </View>
          )}
        </View>
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container3: {
    // flex: 1,
    // backgroundColor: "blue",
    alignItems: "center",
    // marginTop: "-3%",
    // height: "100%",
    width: scale(300),
    marginRight: scale(10),
    marginLeft: scale(10),
    // marginBottom: scale(16),
    borderRadius: 15,
    // backgroundColor: "green"
  },
  picContainer3: {
    width: "100%",
    // height: scale(200),
    marginBottom: scale(5),
    // backgroundColor: "pink",
    backgroundColor: "538bdb",
    // marginTop: "-0%",
    borderRadius: 15,
  },
  shadowbox: {
    flex: 1,
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
  noSightings2: {
    flex: 1,
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    marginTop: "-6%",
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
  helpButton: {
    backgroundColor: "#538bdb",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(15),
    marginLeft: scale(-50),
    borderRadius: 40,
    height: scale(30),
    width: scale(30),
    paddingTop: scale(2),
  },
  helpButtonPressed: {
    backgroundColor: "#538dbd",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(15),
    marginLeft: scale(-50),
    borderRadius: 40,
    height: scale(30),
    width: scale(30),
    paddingTop: scale(2),
  },
});
