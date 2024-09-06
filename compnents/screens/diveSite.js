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
import CloseButton from "../reusables/closeButton";
import { FontAwesome } from "@expo/vector-icons";
import { activeFonts, colors, fontSizes, roundButton } from "../styles";
import { moderateScale } from "react-native-size-matters";
import { UserProfileContext } from "../contexts/userProfileContext";
import { SelectedDiveSiteContext } from "../contexts/selectedDiveSiteContext";
import { AnimalMultiSelectContext } from "../contexts/animalMultiSelectContext";
import { LevelOneScreenContext } from "../contexts/levelOneScreenContext";
import { MaterialIcons } from "@expo/vector-icons";
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
import { getDiveSiteWithUserName, updateDiveSite } from "../../supabaseCalls/diveSiteSupabaseCalls";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

export default function DiveSite(props) {
  const {} = props;
  const { profile } = useContext(UserProfileContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const [site, setSite] = useState("");
  const [diveSiteVals, setDiveSiteVals] = useState({
    diveSitebio: null,
    diveSitePhoto: null,
  });
  const [isEditModeOn, setIsEditModeOn] = useState(false);

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
          photo: site.divesiteprofilephoto
        });
      } catch (e) {
        console.log({ title: "Error19", message: e.message });
      }
  };
  useEffect(() => {
    getDiveSite(selectedDiveSite.SiteName);
    filterAnchorPhotos();
  }, [selectedDiveSite]);

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

  console.log("site is", site)
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
        if (site.diveSiteProfilePhoto !== null || site.diveSiteProfilePhoto === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: site.diveSiteProfilePhoto.split("/").pop(),
          });
        }

        setSite({
          ...site,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveSite({
          ...site,
          photo: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

  const onClose = () => {
    setLevelOneScreen(false);
  };

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
        <View style={{ marginBottom: windowHeight / 70 }}>
          <View style={styles.siteNameContainer}>
            <Text style={styles.header}>{site.name}</Text>
           
            <FontAwesome
              name="flag"
              color="maroon"
              size={moderateScale(16)}
              style={{ marginLeft: moderateScale(10) }}
              onPress={() => null}
            />
          </View>
          <Text style={styles.contributor}>Added by: {site.newusername}</Text>
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
  siteNameContainer: {
    flexDirection: 'row',
    width: 'auto',
    marginTop: Platform.OS === "ios" ? windowHeight / 50 : windowHeight / 50,
    marginLeft: "8%",
  },
  header: {
    zIndex: 10,
    fontSize: moderateScale(fontSizes.Header),
    fontFamily: activeFonts.Regular,
    color: colors.themeBlack,
  },
  contributor: {
    zIndex: 10,
    fontSize: moderateScale(fontSizes.SmallText),
    fontFamily: activeFonts.Thin,
    color: colors.themeBlack,
    marginLeft: "12%",
  },
  scrollViewBox: {
    marginLeft: "2%",
    height: windowHeight / 3.5,
  },
  screenCloseButton: [
    { zIndex: 50, position: "absolute", top: "5%", right: "5%" },
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
