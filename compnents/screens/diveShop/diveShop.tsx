import React, { useEffect, useState } from "react";
import * as S from "./styles";
import { useTranslation } from "react-i18next";
import ItineraryCard from "../../reusables/itineraryCard";
import { openURL } from "expo-linking";
import Label from "../../reusables/label";
import { DiveShop } from "../../../entities/diveShop";
import { ItineraryItem } from "../../../entities/itineraryItem";

type DiveShopProps = {
  isMyShop: boolean;
  itineraryList: ItineraryItem[];
  selectedShop: DiveShop;
  handleMapFlip: (sites: number[]) => void;
  handleEditButton: (sites: ItineraryItem) => void;
  handleDeleteButton: (sites: ItineraryItem) => void;
};

export default function DiveShopScreenView({
  isMyShop,
  itineraryList,
  selectedShop,
  handleMapFlip,
  handleEditButton,
  handleDeleteButton
}: DiveShopProps) {
  
  const { t } = useTranslation()

  const [siteVals, setSiteVals] = useState(null);

  useEffect(() => {
    setSiteVals({
      siteName: selectedShop.orgName,
      bio: selectedShop.diveSiteBio,
    })
  
  },[selectedShop])

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
