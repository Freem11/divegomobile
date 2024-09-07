import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
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
import CloseButton from "../reusables/closeButton";
import { FontAwesome } from "@expo/vector-icons";
import { activeFonts, colors, fontSizes, roundButton } from "../styles";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { MyCreaturesContext } from "../contexts/myCreaturesContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { MaterialIcons } from "@expo/vector-icons";
import email from "react-native-email";
import { newGPSBoundaries } from "../helpers/mapHelpers";
import { chooseImageHandler } from "./imageUploadHelpers";
import {
  uploadphoto,
  removePhoto,
} from "./../cloudflareBucketCalls/cloudflareAWSCalls";
import {
  getPhotosWithUser,
  getPhotosWithUserEmpty,
} from "../../supabaseCalls/photoSupabaseCalls";
import {
  getDiveSiteWithUserName,
  updateDiveSite,
} from "../../supabaseCalls/diveSiteSupabaseCalls";
import BottomDrawer from './animatedBottomDrawer';

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function DiveSite(props) {
  const {} = props;
  const photosRef = useRef(null);
  const bottomSheetRef = useRef(null);
  const { profile } = useContext(UserProfileContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { myCreatures } = useContext(MyCreaturesContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const [diveSitePics, setDiveSitePics] = useState([]);
  const [site, setSite] = useState("");
  const [diveSiteVals, setDiveSiteVals] = useState({
    diveSitebio: null,
    diveSitePhoto: null,
  });
  const [isEditModeOn, setIsEditModeOn] = useState(false);

  const drawerUpperBound = windowHeight*0.9
  const drawerLowerBound = windowWidth > 600 ? moderateScale(220) : moderateScale(290)
  
  useEffect(() => {
    if (!isEditModeOn && site) {
      diveSiteUpdateUpdate();
    }
  }, [isEditModeOn]);

  const diveSiteUpdateUpdate = async () => {
    try {
      const success = await updateDiveSite({
        id: site.id,
        bio: site.divesitebio,
        photo: site.divesiteprofilephoto,
      });
    } catch (e) {
      console.log({ title: "Error19", message: e.message });
    }
  };
  useEffect(() => {
    getDiveSite(selectedDiveSite.SiteName);
    filterAnchorPhotos();
  }, [selectedDiveSite]);

  useEffect(() => {
    getDiveSite(selectedDiveSite.SiteName);
    filterAnchorPhotos();
  }, []);

  const getDiveSite = async () => {
    try {
      const selectedSite = await getDiveSiteWithUserName({
        siteName: selectedDiveSite.SiteName,
        lat: selectedDiveSite.Latitude,
        lng: selectedDiveSite.Longitude,
      });
      if (selectedSite.length > 0) {
        setSite(selectedSite[0]);
      }
    } catch (e) {
      console.log({ title: "Error98", message: e.message });
    }
  };

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
      console.log("phoots?", photos);
      if (photos) {
        // photos.unshift({ id: 0 });
        setDiveSitePics(photos);
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
        if (
          site.divesiteprofilephoto !== null ||
          site.divesiteprofilephoto === ""
        ) {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: site.divesiteprofilephoto.split("/").pop(),
          });
        }

        setSite({
          ...site,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveSite({
          id: site.id,
          bio: site.divesitebio,
          photo: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  const handleEmailDS = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with Dive Site: "${site.name}" at Latitude: ${site.lat} Longitude: ${site.lng} `,
      body:
        "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordinates are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const onClose = () => {
    setLevelOneScreen(false);
  };
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.screenCloseButton}>
        <CloseButton onClose={() => onClose()} />
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
        <View style={styles.siteNameContainer}>
          <Text style={styles.header}>{site.name}</Text>

          <FontAwesome
            name="flag"
            color="maroon"
            size={moderateScale(16)}
            style={{ marginLeft: moderateScale(10) }}
            onPress={() => handleEmailDS()}
          />
        </View>
        <Text style={styles.contributor}>Added by: {site.newusername}</Text>
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
              {site && (
                <PlainTextInput
                  placeHolder={`A little about ${site.name}`}
                  content={site.divesitebio}
                  fontSz={fontSizes.StandardText}
                  isEditModeOn={isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  onChangeText={(bioText) =>
                    setSite({ ...site, divesitebio: bioText })
                  }
                />
              )}
            </ScrollView>
          </View>
        </MaskedView>
      </View>

   
      <WavyHeaderDynamic
        customStyles={styles.svgCurve}
        image={site && site.divesiteprofilephoto}
      ></WavyHeaderDynamic>

<BottomDrawer dataSet={diveSitePics} lowerBound={drawerLowerBound} upperBound={drawerUpperBound}/>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    height: windowHeight,
  },
  contentContainer: {
    alignItems: "left",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    marginTop: Platform.OS === "ios" ? windowHeight / 2.4 : windowHeight / 2.2,
    width: "100%",
    height: 300,
    // backgroundColor: "pink",
  },
  siteNameContainer: {
    // zIndex: 1,
    flexDirection: "row",
    width: "auto",
    marginTop: Platform.OS === "ios" ? windowHeight / 50 : windowHeight / 50,
    marginLeft: "8%",
  },
  header: {
    // zIndex: 50,
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Regular,
    color: colors.themeBlack,
  },
  contributor: {
    // zIndex: 50,
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
    marginLeft: "12%",
  },
  scrollViewBox: {
    // zIndex: 5,
    marginTop: "5%",
    marginLeft: "2%",
    height: windowHeight / 6,
    // backgroundColor: "green"
  },
  screenCloseButton: [
    { zIndex: 1, position: "absolute", top: "5%", right: "5%" },
  ],
  addPhotoButton: [
    { zIndex: 1, position: "absolute", top: "32%", right: "5%" },
  ],
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
  page: {
    position: "absolute",
    zIndex: 1,
    // bottom: -200,
    width: "100%",
    // marginLeft: "1%",
    // marginTop: -windowHeight,
    height: "100%",
  },
  pageContainer: {
    // pointerEvents: "none",
    // justifyContent: "center",
    position: "absolute",
    // top: 0,
    // left: "5%",
    // backgroundColor: "yellow",
  },
  gapBox: { pointerEvents: "none", height: windowHeight * 0.75 },
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
});
