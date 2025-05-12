import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Platform,
} from "react-native";
import PlainTextInput from '../../reusables/plainTextInput';
import { FontAwesome } from "@expo/vector-icons";
import {
  activeFonts,
  colors,
  fontSizes,
  screenSecondaryButton,
  buttonTextAlt,
} from '../../styles';
import * as S from "./styles";
import { moderateScale } from "react-native-size-matters";
import { PinContext } from "../../contexts/staticPinContext";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";
import { AnimalMultiSelectContext } from "../../contexts/animalMultiSelectContext";
import { PreviousButtonIDContext } from "../../contexts/previousButtonIDContext";
import { ActiveScreenContext } from "../../contexts/activeScreenContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import email from "react-native-email";
import { newGPSBoundaries } from "../../helpers/mapHelpers";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { useButtonPressHelper } from "../../FABMenu/buttonPressHelper";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import {
  getPhotosWithUser,
  getPhotosWithUserEmpty,
  getPhotosByDiveSiteWithExtra,
} from "../../../supabaseCalls/photoSupabaseCalls";
import {
  getDiveSiteWithUserName,
  updateDiveSite,
} from "../../../supabaseCalls/diveSiteSupabaseCalls";
import { getItinerariesForDiveSite } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { useTranslation } from "react-i18next";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Label from "../../reusables/label";
import Icon from "../../../icons/Icon";

const windowHeight = Dimensions.get("window").height;

type DiveSiteProps = {
  onClose?: () => void;
  onMapFlip?: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
};

export default function DiveSiteScreen({
  onClose,
  onMapFlip,
  closeParallax,
  restoreParallax,
}: DiveSiteProps) {
  const { profile } = useContext(UserProfileContext);
  const { animalMultiSelection } = useContext(AnimalMultiSelectContext);
  const { pinValues, setPinValues } = useContext(PinContext);
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);
  const { setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { t } = useTranslation();
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const [diveSitePics, setDiveSitePics] = useState([]);
  const [diveSiteVals, setDiveSiteVals] = useState(null);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [isPartnerAccount, setIsPartnerAccount] = useState(false);
  const drawerUpperBound = "90%";
  const drawerLowerBound = "30%";

  const getTrips = async () => {
    const success = await getItinerariesForDiveSite(selectedDiveSite.id);
  };

  const getPhotos = async (site, profile) => {
    const success = await getPhotosByDiveSiteWithExtra({
      lat: site.lat,
      lng: site.lng,
      userId: profile[0].UserID,
    });
    setDiveSitePics(success);
  };

  useEffect(() => {
    getPhotos(selectedDiveSite, profile);
  }, []);

  useEffect(() => {
    getPhotos(selectedDiveSite, profile);
  }, [selectedDiveSite]);

  useEffect(() => {
    if (!isEditModeOn && selectedDiveSite) {
      diveSiteUpdateUpdate();
    }
  }, [isEditModeOn]);

  const diveSiteUpdateUpdate = async () => {
    try {
      const success = await updateDiveSite({
        id: selectedDiveSite.id,
        bio: selectedDiveSite.divesitebio,
        photo: selectedDiveSite.divesiteprofilephoto,
      });
    } catch (e) {
      console.log({ title: "Error19", message: e.message });
    }
  };

  useEffect(() => {
    getTrips();
  }, [selectedDiveSite]);

  // useEffect(() => {
  //   getDiveSite(selectedDiveSite);
  // }, [selectedDiveSite]);

  useEffect(() => {
    if (profile[0].partnerAccount) {
      setIsPartnerAccount(true);
    }
  }, []);

  // const getDiveSite = async (chosenSite) => {
  //   try {
  //     const selectedSite = await getDiveSiteWithUserName({
  //       siteName: chosenSite.name,
  //       region: chosenSite.region,
  //     });
  //     if (selectedSite.length > 0) {
  //       setSite(selectedSite[0]);
  //     }
  //   } catch (e) {
  //     console.log({ title: "Error98", message: e.message });
  //   }
  // };

  // const filterAnchorPhotos = async () => {
  //   let { minLat, maxLat, minLng, maxLng } = newGPSBoundaries(
  //     selectedDiveSite.Latitude,
  //     selectedDiveSite.Longitude
  //   );

  //   try {
  //     let photos;
  //     if (animalMultiSelection.length === 0) {
  //       photos = await getPhotosWithUserEmpty({
  //         userId: profile[0].UserID,
  //         minLat,
  //         maxLat,
  //         minLng,
  //         maxLng,
  //       });
  //     } else {
  //       photos = await getPhotosWithUser({
  //         animalMultiSelection,
  //         userId: profile[0].UserID,
  //         minLat,
  //         maxLat,
  //         minLng,
  //         maxLng,
  //       });
  //     }

  //     if (photos) {
  //       // photos.unshift({ id: 0 });
  //       setDiveSitePics(photos);
  //       let count = 0;
  //       photos.forEach((obj) => {
  //         count++;
  //       });
  //     }
  //   } catch (e) {
  //     console.log({ title: "Error55", message: e.message });
  //   }
  // };

  // const handleImageUpload = async () => {
  //   try {
  //     const image = await chooseImageHandler();
  //     if (image) {

  //       let fileName = await imageUpload(image)

  //       if (
  //         site.divesiteprofilephoto !== null ||
  //         site.divesiteprofilephoto === ""
  //       ) {
  //         await removePhoto({
  //           filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
  //           fileName: selectedDiveSite.divesiteprofilephoto.split("/").pop(),
  //         });
  //       }

  //       setSite({
  //         ...selectedDiveSite,
  //         photo: `animalphotos/public/${fileName}`,
  //       });
  //       const success = await updateDiveSite({
  //         id: selectedDiveSite.id,
  //         bio: selectedDiveSite.divesitebio,
  //         photo: `animalphotos/public/${fileName}`,
  //       });
  //     }
  //   } catch (e) {
  //     console.log("error: Photo Selection Cancelled", e.message);
  //   }
  // };

  const handleEmailDS = () => {
    const to = ["scubaseasons@gmail.com"];
    email(to, {
      // Optional additional arguments
      subject: `Reporting issue with Dive Site: "${selectedDiveSite.name}" at Latitude: ${selectedDiveSite.lat} Longitude: ${selectedDiveSite.lng} `,
      body: "Type of issue: \n \n 1) Dive Site name not correct \n (Please provide the correct dive site name and we will correct the record)\n \n 2)Dive Site GPS Coordinates are not correct \n (Please provide a correct latitude and longitude and we will update the record)",
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };

  const openPicUploader = () => {
    setPinValues({
      ...pinValues,
      Latitude: String(selectedDiveSite.lat),
      Longitude: String(selectedDiveSite.lng),
      siteName: selectedDiveSite.name,
    });
    setLevelOneScreen(false);
    setPreviousButtonID(activeScreen);
    setActiveScreen("PictureUploadScreen");
    useButtonPressHelper(
      "PictureUploadScreen",
      activeScreen,
      levelTwoScreen,
      setLevelTwoScreen
    );
  };

  return (
    <S.ContentContainer>
      {/* <MaterialIcons
        name="chevron-left"
        size={moderateScale(48)}
        color={colors.themeWhite}
        onPress={() => onClose()}
        style={styles.backButton}
      /> */}

      {/* <TouchableWithoutFeedback onPress={openPicUploader}>
        <View style={styles.contributeButton}>
          <Text style={styles.contributeButtonText}>{t('DiveSite.addSighting')}</Text>
        </View>
      </TouchableWithoutFeedback> */}
{/* 
      {profile[0].partnerAccount && (
        <View style={styles.addPhotoButton}>
          <MaterialIcons
            name="add-a-photo"
            size={moderateScale(30)}
            color={colors.themeWhite}
            onPress={() => handleImageUpload()}
          />
        </View>
      )} */}

      <S.InputGroupContainer>
        <View style={styles.siteNameContainer}>
          <S.Header>{selectedDiveSite.name}</S.Header>

          <FontAwesome
            name="flag"
            color="maroon"
            size={moderateScale(16)}
            style={{ marginTop: "5%", marginLeft: moderateScale(10) }}
            onPress={() => handleEmailDS()}
          />
        </View>

        <S.Contributor>Added by: {selectedDiveSite.userName}</S.Contributor>
            {selectedDiveSite && (
                <PlainTextInput
                  placeholder={`A little about ${selectedDiveSite.name}`}
                  value={selectedDiveSite.diveSiteBio}
                  isMyShop={isPartnerAccount}
                  isEditModeOn={isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  onChangeText={(bioText) =>
                    setDiveSiteVals({ ...diveSiteVals, bio: bioText })
                  }
                />
              )}
      </S.InputGroupContainer>

      <S.LabelWrapper>
            <Label label="Sea Life Sightings" />
        </S.LabelWrapper>

      {diveSitePics && diveSitePics.map((photoPacket) => {
  return (
    <S.PhotoContainer key={`${photoPacket.dateTaken}`}>   
      <S.PacketHeader>
        <S.PacketHeaderItem>{photoPacket.dateTaken}</S.PacketHeaderItem>
        <S.IconWrapper>
        <Icon name={'calendar-month'} fill={colors.primaryBlue}/>
        </S.IconWrapper>
      </S.PacketHeader>
      {photoPacket.photos.length > 0 &&
        photoPacket.photos.map((photo) => {
          return (
            <SeaLifeImageCard
              key={`${photo.id}-d`}
              pic={photo}
              dataSetType={"DiveSitePhotos"}
              diveSiteName={photoPacket.name}
            />
          );
        })}
    </S.PhotoContainer>
  );
})}
    </S.ContentContainer>
  );
}

const styles = StyleSheet.create({
  locationHeader: {
    flexDirection: "row",
    height: moderateScale(50),
    width: '100%',
    alignItems: "center",
    justifyContent: "space-around",
    borderBottomWidth: moderateScale(2),
    borderBottomColor: "darkgrey",
    borderTopWidth: moderateScale(2),
    borderTopColor: "darkgrey",
    marginTop: "5%",
    marginBottom: "2%",
    backgroundColor: "lightgray",
  },
  headerText: {
    fontSize: moderateScale(fontSizes.StandardText),
    fontFamily: activeFonts.Medium,
  },
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
    marginTop: "5%",
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
    marginTop: "3%",
    marginLeft: "2%",
    height: windowHeight / 6,
    // backgroundColor: "green"
  },
  contributeButton: [
    { zIndex: 10, position: "absolute", top: "6%", right: "3%" },
    screenSecondaryButton,
  ],
  backButton: [{ zIndex: 10, position: "absolute", top: "5.5%", left: "2%" }],
  contributeButtonText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],
  addPhotoButton: [
    { zIndex: 10, position: "absolute", top: "32%", right: "5%" },
  ],
  svgCurve: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width,
  },
});
