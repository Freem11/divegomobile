import React from "react";
import { moderateScale } from "react-native-size-matters";
import { TouchableOpacity } from "react-native";

import Histogram from "../flatListCombo.tsx/histogram";
import FadeInImage from "../../../reusables/fadeInImage/fadeInImage";
import { PHOTO_SIZES, PhotoVariantSet } from "../../../../entities/photoSizes";

import * as S from "./styles";

type CardProps = {
  id: number;
  name: string;
  photoPath: PhotoVariantSet;
  subData?: string
  onPressHandler: () => void;
  seaLifeSelections?: string
};

export default function Card(props: CardProps) {

  return (
    <TouchableOpacity onPress={props.onPressHandler}>
      <S.ImageHousing key={props.id}>
        <FadeInImage
          photoFile={props.photoPath}
          size={PHOTO_SIZES.Medium}
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
          {props.seaLifeSelections && props.seaLifeSelections === props.name ? <Histogram animal={props.name} /> : null}
          <S.SeaLifeName>{props.name}</S.SeaLifeName>
          <S.SubData>{props.subData}</S.SubData>
        </S.Overlay>
      </S.ImageHousing>
    </TouchableOpacity>
  );
}
