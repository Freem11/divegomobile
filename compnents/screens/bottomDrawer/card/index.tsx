import React from "react";
import { moderateScale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native";

import Histogram from "../flatListCombo.tsx/histogram";
import ImageCasher from "../../../helpers/imageCashing";
import { windowWidth } from "../../../authentication/styles";

import * as S from "./styles";

type CardProps = {
  id: number;
  name: string;
  photoPath: string;
  subData?: string
  onPressHandler: () => void; 
  seaLifeSelections?: string[]
};

export default function Card(props: CardProps) {

  return (
    <TouchableOpacity onPress={props.onPressHandler}>
      <S.ImageHousing key={props.id}>
        <ImageCasher
          photoFile={props.photoPath}
          id={props.id}
          style={{
            flex: 1,
            borderBottomRightRadius: moderateScale(14),
            borderBottomLeftRadius: moderateScale(14),
            borderTopRightRadius: moderateScale(14),
            borderTopLeftRadius: moderateScale(14),
            resizeMode: "cover",
          }}
        />
        <S.Overlay pointerEvents="none">
          {props.seaLifeSelections && props.seaLifeSelections.includes(props.name) ? <Histogram animal={props.name} /> : null}
          <S.SeaLifeName>{props.name}</S.SeaLifeName>
          <S.SubData>{props.subData}</S.SubData>
        </S.Overlay>
      </S.ImageHousing>
    </TouchableOpacity>
  );
}
