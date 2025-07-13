import React, { FC } from "react";
import { moderateScale } from "react-native-size-matters";

import ImageCasherDynamic from "../../helpers/imageCashingDynamic";

import * as S from "./styles";

type Item = {
  photoFile: string;
  id: string
}

interface PreviewGridProps {
  items: Item[];
}

export const PreviewGrid:FC<PreviewGridProps> = ({ items }) => {
  return (
    <S.Container>
      {items.length > 0 && items.map((item, index) => (
        <S.Item
          key={index}
          style={{
            height: moderateScale(50),
            width: moderateScale(50),
            borderRadius: moderateScale(15),
            resizeMode: "cover",
            backgroundColor: "red"
          }}
        >
          <ImageCasherDynamic
            photoFile={item.photoFile}
            style={{
              height: moderateScale(50),
              width: moderateScale(50),
              borderRadius: moderateScale(15),
              resizeMode: "cover",
            }}
          />
        </S.Item>
      ))}
    </S.Container>
  )
}