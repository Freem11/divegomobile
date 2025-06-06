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
import { insertItineraryRequest, itineraries } from "../../../supabaseCalls/itinerarySupabaseCalls";
import { updateDiveShop } from "../../../supabaseCalls/shopsSupabaseCalls";
import { useTranslation } from "react-i18next";
import ItineraryCard from "../../reusables/itineraryCard";
import { ItineraryItem } from "../../entities/itineraryItem";
import { openURL } from "expo-linking";
import { useMapFlip } from "../../itineraries/hooks";
import { SitesArrayContext } from "../../contexts/sitesArrayContext";
import Label from "../../reusables/label";
import { PreviousButtonIDContext } from "../../contexts/previousButtonIDContext";
import { ActiveConfirmationIDContext } from "../../contexts/activeConfirmationIDContext";
import { ConfirmationModalContext } from "../../contexts/confirmationModalContext";
import { ConfirmationTypeContext } from "../../contexts/confirmationTypeContext";
import { TripDetailContext } from "../../contexts/tripDetailsContext";
import { EditModeContext } from "../../contexts/editModeContext";
import { LevelTwoScreenContext } from "../../contexts/levelTwoScreenContext";
import { DiveShop } from "../../../entities/diveShop";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { useMapStore } from "../../googleMap/useMapStore";

type DiveShopProps = {
  onClose?: () => void;
  onMapFlip?: () => void;
  closeParallax?: (mapConfig: number) => void
  restoreParallax?: () => void; 
  isMyShop?: boolean
  bottomHitCount?: number;
  selectedShop: DiveShop
};

export default function DiveShopScreen({
  onClose,
  onMapFlip,
  closeParallax,
  restoreParallax,
  isMyShop,
  bottomHitCount,
  selectedShop
}: DiveShopProps) {
  
  const { profile } = useContext(UserProfileContext);

  const mapRef = useMapStore((state) => state.mapRef);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const setMapConfig = useMapStore((state) => state.actions.setMapConfig);
  
  const [itineraryList, setItineraryList] = useState<ItineraryItem[] | null>();
  const { sitesArray, setSitesArray } = useContext(SitesArrayContext);
  const { setMapCenter } = useContext(MapCenterContext);
  const { zoomHelper, setZoomHelper } = useContext(ZoomHelperContext);
  // const { selectedShop } = useContext(SelectedShopContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(
    LevelOneScreenContext
  );
  const { levelTwoScreen, setLevelTwoScreen } = useContext(
    LevelTwoScreenContext
  );
  const { setEditMode } = useContext(EditModeContext);
  const { formValues, setFormValues } = useContext(TripDetailContext);
  // const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);
  const { setPreviousButtonID } = useContext(PreviousButtonIDContext);
  const { setActiveConfirmationID } = useContext(ActiveConfirmationIDContext);
  const { setConfirmationModal } = useContext(ConfirmationModalContext);
  const { setConfirmationType } = useContext(ConfirmationTypeContext);
  const [diveShopVals, setDiveShopVals] = useState(null);
  const [isEditModeOn, setIsEditModeOn] = useState(false);
  const { t } = useTranslation()

  useEffect(() => {
    if(levelOneScreen){
      restoreParallax();
    }
  }, [levelOneScreen]);

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
        lat: selectedShop.lat,
        lng: selectedShop.lng,
      });
    }
  }, [levelOneScreen]);

  useEffect(() => {
    setDiveShopVals({
      id: selectedShop.id,
      bio: selectedShop.diveshopbio,
      photo: selectedShop.diveshopprofilephoto,
    });

    if (selectedShop) {
      getItineraries(selectedShop.id);
    }
  }, [selectedShop, isEditModeOn]);

  useEffect(() => {
    if (selectedShop) {
      getItineraries(selectedShop.id);
    }
  }, [selectedShop.id]);

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

const handleEditButton = (itineraryInfo) => {
  setLevelOneScreen(false);
  setLevelTwoScreen(true);
  setActiveScreen("TripCreatorScreen", {id: selectedShop.id});
  setEditMode({ itineraryInfo, IsEditModeOn: true });
  setFormValues({ ...itineraryInfo, shopID: selectedShop.id, OriginalItineraryID: itineraryInfo.id })
  setSitesArray(itineraryInfo.siteList)

};

const handleDeleteButton = (itineraryInfo) => {
  insertItineraryRequest(
    {
      BookingLink: itineraryInfo.BookingPage,
      TripName: itineraryInfo.tripName,
      StartDate: itineraryInfo.startDate,
      EndDate: itineraryInfo.endDate,
      Price: itineraryInfo.price,
      TripDesc: itineraryInfo.description,
      DiveSites: itineraryInfo.siteList,
      ShopId: itineraryInfo.shopID,
    },
    "Delete"
  );
  setConfirmationType("Trip Delete");
  setActiveConfirmationID("ConfirmationSuccess");
  setConfirmationModal(true);
};

const handleMapFlip = async (sites: number[]) => {
  console.log('selectedShop', selectedShop.id)
 const coords = await useMapFlip(
    sites,
    setSitesArray,
  )
  setMapConfig(2, selectedShop.id)
  mapRef.animateCamera({ center: {latitude: coords.moveLat, longitude: coords.moveLng},
    zoom: 12,
  });
  closeParallax(1)
};

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
          <S.Header>{selectedShop?.orgName}</S.Header>

          <S.Content>{selectedShop?.diveShopBio}</S.Content>

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
      buttonOneAction={isMyShop ? () => handleEditButton(itinerary) : () => handleMapFlip(itinerary.siteList)}
      buttonTwoAction={isMyShop ? () => handleDeleteButton(itinerary) :() => openURL(itinerary.BookingPage)}
    />
  );
})}

    </S.ContentContainer>
  );
}
