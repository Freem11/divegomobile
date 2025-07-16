import React, { FC, useMemo } from "react";
import { Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";

import ImageCasherDynamic from "../../helpers/imageCashingDynamic";
import {DiveSiteWithUserName} from "../../../entities/diveSite";

import * as S from "./styles";

interface PreviewGridProps {
  items: DiveSiteWithUserName[];
}

export const PreviewGrid:FC<PreviewGridProps> = ({ items }) => {
  const screenWidth = Dimensions.get("window").width;
  const containerPadding = 20;
  const gap = 8;
  const numColumns = 3;
  
  const itemSize = useMemo(() => {
    const availableWidth = screenWidth - (containerPadding * 2);
    const totalGaps = gap * (numColumns - 1);
    return (availableWidth - totalGaps) / numColumns;
  }, [screenWidth]);

  return (
    <S.Container>
      {items.length > 0 && items.map((item, index) => (
        <S.Item
          key={index}
          style={{
            width: itemSize,
            height: itemSize,
            borderRadius: moderateScale(8),
            marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
            marginBottom: gap,
          }}
        >
          <ImageCasherDynamic
            photoFile={item.photofile}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: moderateScale(8),
              resizeMode: "cover",
            }}
          />
        </S.Item>
      ))}
    </S.Container>
  )
}