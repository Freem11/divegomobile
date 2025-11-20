import React from "react";
import { openURL } from "expo-linking";

import ItineraryCard from "../../reusables/itineraryCard";
import { DiveShop } from "../../../entities/diveShop";
import { ItineraryItem } from "../../../entities/itineraryItem";
import Label from "../../reusables/label";
import EmptyState from "../../reusables/emptyState-new";

import * as S from "./styles";

type DiveShopProps = {
  isMyShop: boolean;
  itineraryList: ItineraryItem[];
  selectedShop: DiveShop;
  handleMapFlip: (sites: number[]) => void;
  handleEditButton: (id: number) => void;
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
          {tripsCount ? `${tripsCount} active trip${tripsCount === 1 ? "" : "s"}` : null}
        </S.SectionCount>
      </S.LabelWrapper>

      {itineraryList && itineraryList.length > 0 ? itineraryList.map((itinerary) => {
        return (
          <ItineraryCard
            key={itinerary.id}
            isMyShop={isMyShop}
            itinerary={itinerary}
            handleEdit={() => handleEditButton(itinerary.id)}
            handleDelete={handleDeleteButton}
            handleMapFlip={() => handleMapFlip(itinerary.siteList)}
            handleBooking={() => openURL(itinerary.BookingPage)}
          />
        );
      }) : (
        <S.EmptyStateWrapper>
          <EmptyState
            iconName="diving-scuba-flag"
            title="No Trips Available"
            subtitle={selectedShop?.orgName ?
              `${selectedShop?.orgName} currently aren't offering any trips. Check back later!` :
              "There are currently no diving trips scheduled for this location. Check back later!"}
          />
        </S.EmptyStateWrapper>
      )}
    </S.ContentContainer>
  );
}
