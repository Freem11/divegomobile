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
  isMyShop?: boolean
};

export default function DiveSiteScreen({
  onClose,
  onMapFlip,
  closeParallax,
  restoreParallax,
  isMyShop
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


      {/* <TouchableWithoutFeedback onPress={openPicUploader}>
        <View style={styles.contributeButton}>
          <Text style={styles.contributeButtonText}>{t('DiveSite.addSighting')}</Text>
        </View>
      </TouchableWithoutFeedback> */}

      <S.InputGroupContainer>
        <S.SiteNameContainer>
          <S.Header>{selectedDiveSite.name}</S.Header>

          <FontAwesome
            name="flag"
            color="maroon"
            size={moderateScale(16)}
            style={{ marginTop: "5%", marginLeft: moderateScale(10) }}
            onPress={() => handleEmailDS()}
          />
        </S.SiteNameContainer>

        <S.Contributor>Added by: {selectedDiveSite.userName}</S.Contributor>
            {selectedDiveSite && (
                <PlainTextInput
                  placeholder={`A little about ${selectedDiveSite.name}`}
                  value={selectedDiveSite.diveSiteBio}
                  isMyShop={isMyShop}
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
        photoPacket.photos.map((photo, index) => {
          return (
            <SeaLifeImageCard
              key={`${photo.id}-${index}`}
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
  contributeButton: [
    { zIndex: 10, position: "absolute", top: "6%", right: "3%" },
    screenSecondaryButton,
  ],
  contributeButtonText: [buttonTextAlt, { marginHorizontal: moderateScale(5) }],

  
});
