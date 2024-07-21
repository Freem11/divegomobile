import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import Share from "react-native-share";
import React, { useState, useContext, useEffect } from "react";
import {
  getPhotosWithUser,
  getPhotosWithUserEmpty,
} from "../../supabaseCalls/photoSupabaseCalls";
import { getDiveSiteWithUserName } from "../../supabaseCalls/diveSiteSupabaseCalls";
import * as FileSystem from "expo-file-system";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { IterratorContext } from "../contexts/iterratorContext";
import { MyCreaturesContext } from "../contexts/myCreaturesContext";
import { PinContext } from "../contexts/staticPinContext";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedPhotoContext } from "../contexts/selectedPhotoContext";
import { LargeModalContext } from "../contexts/largeModalContext";
import { LargeModalSecondContext } from "../contexts/largeModalSecondContext";
import { FullScreenModalContext } from "../contexts/fullScreenModalContext";
import { ActiveButtonIDContext } from "../contexts/activeButtonIDContext";
import { ActiveTutorialIDContext } from "../contexts/activeTutorialIDContext";
import { PreviousButtonIDContext } from "../contexts/previousButtonIDContext";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { scale } from "react-native-size-matters";
import { MaterialIcons } from "@expo/vector-icons";
import email from "react-native-email";
import ImgToBase64 from "react-native-image-base64";
import Picture from "./picture";
import ModalHeader from "../reusables/modalHeader";

let GoogleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;

export default function AnchorModal(props) {
  const { largeModal, setLargeModal } = useContext(LargeModalContext);
  const { largeModalSecond, setLargeModalSecond } = useContext(
    LargeModalSecondContext
  );
  const { setFullScreenModal } = useContext(
    FullScreenModalContext
  );
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { activeButtonID, setActiveButtonID } = useContext(
    ActiveButtonIDContext
  );
  const { setActiveTutorialID } = useContext(
    ActiveTutorialIDContext
  );
  const { setSelectedPhoto } = useContext(SelectedPhotoContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const [anchorPics, setAnchorPics] = useState([]);
  const { myCreatures } = useContext(MyCreaturesContext);
  const { profile } = useContext(UserProfileContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { itterator, setItterator } = useContext(IterratorContext);
  const [site, setSite] = useState("");
  const { pinValues, setPinValues } = useContext(PinContext);

  const filterAnchorPhotos = async () => {
    let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
      selectedDiveSite.Latitude,
      selectedDiveSite.Longitude
    );

    try {
      let photos;
      if (animalMultiSelection.length === 0) {
        photos = await getPhotosWithUserEmpty({
          myCreatures,
          userId: profile[0].UserID,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
      } else {
        photos = await getPhotosWithUser({
          animalMultiSelection,
          myCreatures,
          userId: profile[0].UserID,
          minLat,
          maxLat,
          minLng,
          maxLng,
        });
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
      }
    } catch (e) {
      console.log({ title: "Error55", message: e.message });
    }
  };

  useEffect(() => {
    getDiveSite(selectedDiveSite.SiteName);
    filterAnchorPhotos();

    if (itterator === 11 && anchorPics.length === 0) {
      setItterator(12);
    } else if (itterator === 11 && anchorPics.length > 0) {
      setItterator(13);
    }

  }, [selectedDiveSite]);

  useEffect(() => {
    if (itterator === 20) {
      filterAnchorPhotos();
    }
  }, [itterator]);



  const getDiveSite = async () => {
    try {
      const selectedSite = await getDiveSiteWithUserName({
        siteName: selectedDiveSite.SiteName,
        lat: selectedDiveSite.Latitude,
        lng: selectedDiveSite.Longitude,
      });
      if (selectedSite.length > 0) {
        setSite(selectedSite[0].newusername);
      }
    } catch (e) {
      console.log({ title: "Error98", message: e.message });
    }
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
    setActiveButtonID(null);
    if (itterator === 15) {
      setItterator((prev) => prev + 1);
      setFullScreenModal(true);
      setActiveTutorialID("FirstGuide");
    }

    if (itterator === 12) {
      setFullScreenModal(false);
      setItterator(11)
    }

    if (itterator === 18) {
      setFullScreenModal(false);
    }
    setPreviousButtonID(activeButtonID);
    setActiveButtonID("SiteAnchorIcon");
    setLargeModal(false);
  };

  const handleSwitch = () => {
    if (itterator === 11 || itterator == 15) {
      return;
    }
    setPinValues({
      ...pinValues,
      Latitude: String(selectedDiveSite.Latitude),
      Longitude: String(selectedDiveSite.Longitude),
    });
    setPreviousButtonID(activeButtonID);
    setLargeModal(false);
    setLargeModalSecond(true);
    setActiveButtonID("PictureAdderButton");
  };

  useEffect(() => {
    console.log(activeButtonID, largeModalSecond)
  }, [activeButtonID]);



  const togglePhotoBoxModal = (photo) => {
    setSelectedPhoto(photo);
    setFullScreenModal(true);
    setActiveTutorialID("PinchAndZoomPhoto");
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
      shareOptions.message = `Checkout this cool pic of a ${creastureN} on Scuba SEAsons! It was taken by ${userN} at the dive site: ${selectedDiveSite.SiteName}, in${mapLocal} on ${photoDate}.\nMaybe we should start contributing out pics as well!\n\nLearn more about it here:\n${localUri}`;
      shareOptions.url = `data:image/jpg;base64,${base64}`;
      doShare(shareOptions);
    }
    setBase64(null);
  }, [base64]);

  return (
    <View
      style={{
        height: "98%",
        overflow: "hidden",
      }}
    >
      <ModalHeader
        titleText={selectedDiveSite.SiteName}
        subText={`Added by: ${site}`}
        onClose={handleAnchorModalClose}
        icon={"add-a-photo"}
        altButton={handleSwitch}
        tertButton={handleEmailDS}
      />
      <ScrollView style={{ marginTop: "2%", width: "100%", borderRadius: 15 }}>
        <View style={styles.container3}>
          {anchorPics &&
            anchorPics.map((pic) => {
              return (
                <TouchableWithoutFeedback
                  key={pic.id}
                  onPress={() => togglePhotoBoxModal(pic.photofile)}
                >
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
                onPress={handleSwitch}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  width: scale(32),
                  height: scale(32),
                  borderRadius: scale(32),
                  backgroundColor: "black",
                }}
              >
                <View
                  style={{
                    borderRadius: scale(40),
                    backgroundColor: "white",
                    width: scale(100),
                    height: scale(40),
                    alignSelf: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 5,

                    elevation: 10,
                  }}
                >
                  <MaterialIcons
                    name="add-a-photo"
                    size={scale(32)}
                    color="#538dbd"
                  />
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
    alignItems: "center",
    width: scale(300),
    marginRight: scale(10),
    marginLeft: scale(10),
    borderRadius: 15,
  },
  picContainer3: {
    width: "100%",
    marginBottom: scale(5),
    backgroundColor: "538bdb",
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
  },
  flagMajor: {
    // backgroundColor: "orange",
    width: "10%",
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
  },
  headerAlt: {
    flexWrap: "wrap",
    fontFamily: "PatrickHand_400Regular",
    color: "#F0EEEB",
    fontSize: scale(22),
    flexWrap: "wrap",
    width: "90%",
    // backgroundColor: "green"
  },
  dsCredit: {
    fontFamily: "Itim_400Regular",
    color: "#F0EEEB",
    fontSize: scale(9),
    // backgroundColor: "blue"
  },
  titleAlt: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    marginTop: scale(10),
    // backgroundColor: 'pink'
  },
  closeButtonAlt: {
    position: "relative",
    alignItems: "center",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: "10%",
    // backgroundColor: "yellow"
  },
  closeButtonAltPressed: {
    position: "relative",
    alignItems: "center",
    borderRadius: scale(42 / 2),
    height: scale(30),
    width: "10%",
    justifyContent: "center",
    backgroundColor: "lightgrey",
    opacity: 0.3,
  },
  helpButton: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(25),
    marginLeft: scale(-50),
    borderRadius: scale(40),
    height: scale(30),
    width: "20%",
  },
  helpButtonPressed: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    marginRight: scale(25),
    marginLeft: scale(-50),
    borderRadius: scale(40),
    height: scale(30),
    width: "20%",
  },
});
