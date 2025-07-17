import React from "react";
import { FlatList } from "react-native";
import ButtonIcon from '../../reusables/buttonIcon'
import { useTranslation } from "react-i18next";
import ItineraryCard from "../../reusables/itineraryCard";
import { openURL } from "expo-linking";
import * as S from "./styles";

type DiveSiteTripsPageViewProps = {
  diveTrips: any
  title: string
  setFullScreenModal: React.Dispatch<React.SetStateAction<boolean>>
  handleMapFlip: (sites: number[], shopID?: number) => void;
};

export default function DiveSiteTripsPageView({ 
  diveTrips,
  title,
  setFullScreenModal,
  handleMapFlip,
 }: DiveSiteTripsPageViewProps) {

  const { t } = useTranslation();

  console.log('diveTrips', diveTrips)
  
  return (
    <S.ContentContainer>

<S.SafeArea>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={() => setFullScreenModal(false)}
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