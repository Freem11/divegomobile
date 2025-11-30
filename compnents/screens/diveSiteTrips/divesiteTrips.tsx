import React, { useContext } from "react";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import { openURL } from "expo-linking";

import ItineraryCard from "../../reusables/itineraryCard";
import ButtonIcon from "../../reusables/buttonIcon";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";

import * as S from "./styles";

type DiveSiteTripsPageViewProps = {
  diveTrips: any
  title: string
  onClose: () => void;
  handleMapFlip: (sites: number[], shopID?: number) => void;
};

export default function DiveSiteTripsPageView({
  diveTrips,
  title,
  onClose,
  handleMapFlip,
}: DiveSiteTripsPageViewProps) {

  const { t } = useTranslation();
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);

  return (
    <S.ContentContainer>

      <S.SafeArea>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={onClose}
            size="small"
            fillColor={"darkgrey"}
          />
        </S.BackButtonWrapper>

      </S.SafeArea>

      <S.Header>Offered Trips to: {title}</S.Header>

      <FlatList
        data={diveTrips}
        keyExtractor={(index) => index}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => (
          <ItineraryCard
            key={item.id}
            itinerary={item}
            buttonOneAction={() => handleMapFlip(item.siteList, item.shopID)}
            buttonTwoAction={() => openURL(item.BookingPage)}
          />
        )}
      />
    </S.ContentContainer>
  );

}