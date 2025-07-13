import React from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import * as S from "./styles";
import { colors } from "../styles";
import Icon from "../../icons/Icon";

export default function SearchToolListItem({ name, soureImage, handleMapOptionSelected, handleDiveSiteOptionSelected, handleSeaLifeOptionSelected }) {

  const onPressItem = () => {
    if (soureImage === "anchor") {
      handleDiveSiteOptionSelected(name);
    } else if (soureImage === "shark") {
      handleSeaLifeOptionSelected(name);
    } else {
      handleMapOptionSelected(name);
    }
  };

  return (
      <S.SearchResultContainer>
      <View style={{ paddingLeft: moderateScale(8), justifyContent: "center" }}>
        <TouchableOpacity onPress={onPressItem}>
          <S.SearchCard>
            <S.CardIconContainer>
              <S.CardIcon>
            {soureImage === "anchor" ?
              <Icon name={'anchor'} fill={colors.themeGreen}/>
              :
              soureImage === "shark"  ? 
              <Icon name={'shark'} fill={colors.primaryBlue}/>
              :
              <Icon name={'compass-outline'} fill={colors.themeBlack}/>
              }
              </S.CardIcon>
            </S.CardIconContainer>

            <S.LabelContainer>
              <S.SearchResultText>{name}</S.SearchResultText>
            </S.LabelContainer>

          </S.SearchCard>
        </TouchableOpacity>
      </View>
    </S.SearchResultContainer>
  );
};
