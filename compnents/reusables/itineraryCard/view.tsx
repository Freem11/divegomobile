import React, { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

import readableDate from "../../helpers/readableDate";
import { ItineraryItem } from "../../../entities/itineraryItem";
import { colors } from "../../styles";
import Icon from "../../../icons/Icon";

import * as S from "./styles";
import { Menu } from "./Menu";

type TripCardViewProps = {
  itinerary:           ItineraryItem
  flipMap:             (siteList: number[]) => Promise<void>
  isMyShop?:           boolean
  handleEdit: (sites: ItineraryItem) => void;
  handleDelete: (sites: ItineraryItem) => void;
  handleMapFlip: () => void;
  handleBooking: () => void;
};

export default function ItineraryCardView({
  itinerary,
  flipMap,
  isMyShop,
  handleEdit,
  handleDelete,
  handleMapFlip,
  handleBooking
}: TripCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(0);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  return (
    <S.Card>
      <S.CardTop>
        <S.Header>
          <S.Title>{itinerary.tripName}</S.Title>
          {isMyShop && (
            <Menu
              isVisible={isPopoverVisible}
              setIsVisible={setIsPopoverVisible}
              handleDelete={() => handleDelete(itinerary)}
              handleEdit={() => handleEdit(itinerary)}
            />
          )}
        </S.Header>
        <View style={{ flexDirection: "row", marginRight: -moderateScale(2) }}>
          <Icon
            name={"calendar-month"}
            style={{ width: moderateScale(18), marginRight: moderateScale(4) }}
            fill={colors.darkGrey}
          />
          <S.Date>
            {itinerary.startDate && readableDate(itinerary.startDate)}
            {" - "}
            {itinerary.endDate && readableDate(itinerary.endDate)}
          </S.Date>
        </View>

        <View style={{ flexDirection: "row", marginRight: -moderateScale(2) }}>
          <Icon
            name={"currency-usd"}
            style={{ width: moderateScale(18), marginRight: moderateScale(4) }}
            fill={colors.themeGreen}
          />
          <S.Price>{itinerary.price.replace(/\$/g, "")} per person</S.Price>
        </View>

      </S.CardTop>

      <S.Description>
        {isExpanded ? (
          <S.DescriptionTextExpanded>
            {itinerary.description}
          </S.DescriptionTextExpanded>
        )
          : (
            <S.DescriptionTextCollapsed
              ellipsizeMode="tail"
              numberOfLines={isMeasuring === 0 ? undefined : 2}
              onTextLayout={(e) => {
                const lines = e.nativeEvent.lines.length;
                if (lines > 2){
                  setIsOverflowing(true);
                }
                setIsMeasuring(2);
              }}
            >
              {itinerary.description}
            </S.DescriptionTextCollapsed>
          )}

        {isOverflowing && (
          <S.ShowMoreText
            onPress={() => setIsExpanded(prev => !prev)}
          >
            {isExpanded ? "Read less" : "Read more"}
          </S.ShowMoreText>
        )}
        <S.ButtonsContainer>
          <S.ButtonWrapper>
            <S.StyledButton
              size={"thin"}
              title={"View on Map"}
              iconLeft={"map-outlined"}
              round={false}
              onPress={handleMapFlip}
            />
          </S.ButtonWrapper>
          <S.ButtonWrapper>
            <S.StyledButton
              size={"thin"}
              title={"Book Trip"}
              round={false}
              alt
              onPress={handleBooking}
            />
          </S.ButtonWrapper>
        </S.ButtonsContainer>
      </S.Description>
    </S.Card>
  );
}
