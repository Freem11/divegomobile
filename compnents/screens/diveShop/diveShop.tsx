import React from "react";
import { openURL } from "expo-linking";

import ItineraryCard from "../../reusables/itineraryCard";
import Label from "../../reusables/label-new";
import { DiveShop } from "../../../entities/diveShop";
import { ItineraryItem } from "../../../entities/itineraryItem";

import * as S from "./styles";

type DiveShopProps = {
  isMyShop: boolean;
  itineraryList: ItineraryItem[];
  selectedShop: DiveShop;
  handleMapFlip: (sites: number[]) => void;
  handleEditButton: (sites: ItineraryItem) => void;
  handleDeleteButton: (sites: ItineraryItem) => void;
  tripsCount: number;
};

export default function DiveShopScreenView({
  isMyShop,
  itineraryList,
  selectedShop,
  handleMapFlip,
  handleEditButton,
  handleDeleteButton,
  tripsCount
}: DiveShopProps) {
  return (
    <S.ContentContainer>
      <S.InfoContainer>
        <S.Header>{selectedShop?.orgName}</S.Header>
        {selectedShop?.diveShopBio ? <S.Content>{selectedShop?.diveShopBio}</S.Content> : null}
      </S.InfoContainer>

      <S.LabelWrapper>
        <Label label="Trips" />
        <S.SectionCount>
          {tripsCount ? `${tripsCount} trips` : null}
        </S.SectionCount>
      </S.LabelWrapper>

      {itineraryList && itineraryList.map((itinerary) => {
        return (
          <ItineraryCard
            key={itinerary.id}
            isMyShop={isMyShop}
            itinerary={itinerary}
            handleEdit={handleEditButton}
            handleDelete={handleDeleteButton}
            handleMapFlip={() => handleMapFlip(itinerary.siteList)}
            handleBooking={() => openURL(itinerary.BookingPage)}
          />
        );
      })}
    </S.ContentContainer>
  );
}
