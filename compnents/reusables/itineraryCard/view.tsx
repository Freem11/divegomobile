import React, { forwardRef, useRef, useState } from 'react';
import * as S from './styles'
import { ItineraryItem } from '../../entities/itineraryItem';
import ButtonIcon from "../buttonIcon";
import readableDate from "../../helpers/readableDate";
import { colors } from "../../styles";
import Popover from 'react-native-popover-view';
import { Placement } from "react-native-popover-view/dist/Types";
import { View } from "react-native";
import IconWithLabel from '../iconWithLabal';

type TripCardViewProps = {
  itinerary:           ItineraryItem
  flipMap:             (siteList: number[]) => Promise<void>
  canChangeItinerary?: boolean
  buttonOneAction:  () => void
  buttonTwoAction:    () => void  
};

export default function ItineraryCardView({ itinerary, flipMap, canChangeItinerary, buttonOneAction, buttonTwoAction }: TripCardViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [isMeasuring, setIsMeasuring] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const iconRef = useRef();
  
  const ButtonIconWithRef = forwardRef(() => (
    <View ref={iconRef}>
         <ButtonIcon 
          icon="dots-horizontal"
          size='icon'
          onPress={() => setIsVisible(true)}
          fillColor={colors.neutralGrey}
        />
    </View>
  ));

  const handleButtonPress = (action: () => void) => {
    action()
    setIsVisible(false);
  }

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
          
        <ButtonIconWithRef ref={iconRef}/>

                <Popover
                from={iconRef}
                isVisible={isVisible}
                onRequestClose={() => setIsVisible(false)}
                placement={Placement.AUTO}
                >
                   
                 {canChangeItinerary ?  <>
                  <ButtonIcon 
                  icon="pencil"
                  onPress={() => buttonOneAction(itinerary)}
                  size='icon'
                  fillColor={colors.neutralGrey}
                  />

                  <ButtonIcon 
                  icon="trash"
                  onPress={() => buttonTwoAction(itinerary)}
                  size='icon'
                  fillColor={colors.neutralGrey}
                  />
                </> 
                :
                <>
                <IconWithLabel 
                label="View on Map"
                iconName="anchor"
                buttonAction={() => handleButtonPress(buttonOneAction)}
                />

                <IconWithLabel 
                label="Book Trip"
                iconName="diving-scuba-flag"
                buttonAction={() => handleButtonPress(buttonTwoAction)}
                />
              </>
               }
              </Popover>
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
