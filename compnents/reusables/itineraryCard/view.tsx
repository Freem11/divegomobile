import React, { useEffect, useState } from 'react';
import * as S from './styles'
import { ItineraryItem } from '../../entities/itineraryItem';
import ButtonIcon from "../buttonIcon";
import readableDate from "../../helpers/readableDate";
import { colors } from "../../styles";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolate,
} from "react-native-reanimated";
import { scale } from "react-native-size-matters";

type TripCardViewProps = {
  itinerary:           ItineraryItem
  flipMap:             (siteList: number[]) => Promise<void>
  canChangeItinerary?: boolean
  handleDeleteButton:  (itinerary: ItineraryItem) => void
  handleEditButton:    (itinerary: ItineraryItem) => void
  selectedID: number
  setSelectedID: () => void
  
};

export default function ItineraryCardView({ itinerary, flipMap, canChangeItinerary, handleDeleteButton, handleEditButton, selectedID, setSelectedID }: TripCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(0);
  const moreInfoHeight = useSharedValue(0);

  const toVal = scale(100);

  const moreInfoHeigth = useDerivedValue(() => {
    return interpolate(moreInfoHeight.value, [0, 1], [0, toVal]);
  });

  const tabPullx = useAnimatedStyle(() => {
    return {
      height: moreInfoHeigth.value,
    };
  });

  const startMoreInfoAnimation = (id) => {
    setSelectedID(id);

    if (moreInfoHeight.value === 0) {
      moreInfoHeight.value = withTiming(1);
    } else {
      moreInfoHeight.value = withTiming(0);
    }
  };

  const releaseMoreInfoAnimations = () => {
    moreInfoHeight.value = withTiming(0);
  };

  useEffect(() => {
    if (selectedID !== itinerary.id) {
      releaseMoreInfoAnimations();
    }
  }, [selectedID]);

  return (
    <S.Card>
      <S.CardTop>
        <S.MainContent>
          <S.Title>{itinerary.tripName}</S.Title>
          <S.Info>
            <S.TopText>
              {itinerary.startDate && readableDate(itinerary.startDate)}
              {' - '}
              {itinerary.endDate && readableDate(itinerary.endDate)}
            </S.TopText>
            <S.TopText>  •  </S.TopText>
            <S.TopText>{itinerary.price}</S.TopText>
          </S.Info>
        </S.MainContent>

        <S.Actions>
          {canChangeItinerary
            ? (
                <>
                  <ButtonIcon 
                  icon="pencil"
                  onPress={() => handleEditButton(itinerary)}
                  size='icon'
                  fillColor={colors.neutralGrey}
                  />

                  <ButtonIcon 
                  icon="trash"
                  onPress={() => handleDeleteButton(itinerary)}
                  size='icon'
                  fillColor={colors.neutralGrey}
                  />
                </>
              )
            : (
                <>
                  <ButtonIcon 
                  icon="anchor"
                  onPress={() => itinerary.siteList && flipMap(itinerary.siteList)}
                  size='icon'
                  fillColor={colors.neutralGrey}
                  />
                  <ButtonIcon 
                  icon="diving-scuba-flag"
                  onPress={null}
                  size='icon'
                  fillColor={colors.neutralGrey}
                  />
                </>
              )}
        </S.Actions>
      </S.CardTop>

      <S.Description>
       {isExpanded ? 
       <S.DescriptionTextExpanded>
          {itinerary.description}
        </S.DescriptionTextExpanded>
         :
         <S.DescriptionTextCollapsed
         ellipsizeMode="tail"
         numberOfLines={isMeasuring === 0 ? undefined : 2}
         onTextLayout={(e) => {
           const lines = e.nativeEvent.lines.length;
           console.log(lines, lines)
            if(lines > 2){
              setIsOverflowing(true);
            }
            setIsMeasuring(2)
         }}
       >
         {itinerary.description}
       </S.DescriptionTextCollapsed>}

        {isOverflowing && (
          <S.ShowMoreText
            onPress={() => setIsExpanded(prev => !prev)}
          >
            {isExpanded ? 'Read less' : 'Read more'}
          </S.ShowMoreText>
        )}
      </S.Description>
    </S.Card>
  );
}
