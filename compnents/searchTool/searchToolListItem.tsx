import React from "react";
import {
  View,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

import * as S from "./styles";

export default function SearchToolListItem({ name, soureImage, handleMapOptionSelected, handleDiveSiteOptionSelected }) {

  const onPressItem = () => {
    if (soureImage === "anchor") {
      handleDiveSiteOptionSelected(name);
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
              <S.CardIcon
                source={soureImage === "anchor"
                  ? require("../png/mapIcons/AnchorBlueA.png")
                  : require("../png/compass.png")}
              />
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
