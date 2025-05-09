import React, { useState, useContext, useEffect } from "react";
import PlainTextInput from '../../reusables/plainTextInput';
import * as S from "./styles";
import { UserProfileContext } from "../../contexts/userProfileContext";
import { SelectedShopContext } from "../../contexts/selectedShopContext";
import { LevelOneScreenContext } from "../../contexts/levelOneScreenContext";
import { MapCenterContext } from "../../contexts/mapCenterContext";
import { ZoomHelperContext } from "../../contexts/zoomHelperContext";
import { chooseImageHandler, imageUpload } from "../imageUploadHelpers";
import { removePhoto } from "../../cloudflareBucketCalls/cloudflareAWSCalls";
import { itineraries } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { useTranslation } from "react-i18next";
import ItineraryCard from "../../reusables/itineraryCard";
import { ItineraryItem } from "../../entities/itineraryItem";
import { openURL } from "expo-linking";
import { useMapFlip } from "../../itineraries/hooks";
import { MapConfigContext } from "../../contexts/mapConfigContext";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import Label from "../../reusables/label";

type DiveShopProps = {
  onClose: () => void;
  onMapFlip?: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
};

export default function DiveShopScreen({
  onClose,
  onMapFlip,
  closeParallax,
  restoreParallax
}: DiveShopProps) {
  const { profile } = useContext(UserProfileContext);
  const [itineraryList, setItineraryList] = useState<ItineraryItem[] | null>();
  const [selectedID, setSelectedID] = useState<number | null>(null);

  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { setMapConfig } = useContext(MapConfigContext);
  const { setMapCenter } = useContext(MapCenterContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);
  const { selectedShop } = useContext(SelectedShopContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const [diveShopVals, setDiveShopVals] = useState(null);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const [isMyShop, setIsMyShop] = useState(false);
  const { t } = useTranslation()
  const drawerUpperBound = "90%";
  const drawerLowerBound = "30%";

  const getItineraries = async (IdNum) => {
    try {
      const itins = await itineraries(IdNum);
      setItineraryList(itins);
    } catch (e) {
      console.log({ title: "Error", message: e.message });
    }
  };

  useEffect(() => {
    if (levelOneScreen && zoomHelper) {
      setMapCenter({
        lat: selectedShop[0].lat,
        lng: selectedShop[0].lng,
      });
    }
  }, [levelOneScreen]);

  useEffect(() => {
    if (
      profile[0].partnerAccount &
      (selectedShop[0].userId === profile[0].UserID)
    ) {
      setIsMyShop(true);
    } else {
      setIsMyShop(false);
    }

    setDiveShopVals({
      id: selectedShop[0].id,
      bio: selectedShop[0].diveShopBio,
      photo: selectedShop[0].diveShopProfilePhoto,
    });

    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
    }
  }, [selectedShop, isEditModeOn]);

  useEffect(() => {
    if (selectedShop[0]) {
      getItineraries(selectedShop[0].id);
    }
  }, [selectedShop[0].id]);

  useEffect(() => {
    if (!isEditModeOn && diveShopVals) {
      diveShopUpdateUpdate();
    }
  }, [isEditModeOn]);

  const diveShopUpdateUpdate = async () => {
    try {
      const success = await updateDiveShop({
        id: diveShopVals.id,
        bio: diveShopVals.bio,
        photo: diveShopVals.photo,
      });
    } catch (e) {
      console.log({ title: "Error19", message: e.message });
    }
  };

  const handleImageUpload = async () => {
    try {
      const image = await chooseImageHandler();
      if (image) {

        let fileName = await imageUpload(image)

        if (diveShopVals.photo !== null || diveShopVals.photo === "") {
          await removePhoto({
            filePath: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/`,
            fileName: diveShopVals.photo.split("/").pop(),
          });
        }

        setDiveShopVals({
          ...diveShopVals,
          photo: `animalphotos/public/${fileName}`,
        });
        const success = await updateDiveShop({
          id: diveShopVals.id,
          bio: diveShopVals.bio,
          photo: `animalphotos/public/${fileName}`,
        });
      }
    } catch (e) {
      console.log("error: Photo Selection Cancelled", e.message);
    }
  };

let isReadOnly = false

if(isMyShop){
  isReadOnly = false
} else if (!isMyShop && !isEditModeOn){
  isReadOnly = false
} else if (!isMyShop && isEditModeOn){
  isReadOnly = true
}

  return (
    <S.ContentContainer>

      {/* {isMyShop && (
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
          <S.Header>{selectedShop[0].orgName}</S.Header>

              {selectedShop && (
                <PlainTextInput
                  placeholder={`A little about ${selectedShop[0].orgName}`}
                  content={diveShopVals && diveShopVals.bio}
                  isMyShop={isMyShop}
                  isEditModeOn={isEditModeOn}
                  setIsEditModeOn={setIsEditModeOn}
                  onChangeText={(bioText) =>
                    setDiveShopVals({ ...diveShopVals, bio: bioText })
                  }
                />
              )}

      </S.InputGroupContainer>

        <S.LabelWrapper>
            <Label label="Dive Trips" />
        </S.LabelWrapper>

      {itineraryList && itineraryList.map((itinerary) => {
  return (
    <ItineraryCard  
      key={itinerary.id}
      isMyShop={isMyShop}
      itinerary={itinerary}    
      buttonOneAction={() => useMapFlip(
        itinerary.siteList,
        setSitesArray,
        setZoomHelper,
        setLevelOneScreen,
        setMapConfig,
        setMapCenter
      )}
      buttonTwoAction={() => openURL(itinerary.BookingPage)}
    />
  );
})}

    </S.ContentContainer>
  );
}
