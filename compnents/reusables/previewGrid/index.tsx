import React, { FC, useMemo } from "react";
import { Image, Dimensions } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { DiveSiteWithUserName } from "../../../entities/diveSite";

import * as S from "./styles";

interface PreviewGridProps {
  items: DiveSiteWithUserName[] | null;
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
      {items && items.length > 0 && items.map((item, index) => {
      const fileName = item.photofile?.split("/").pop();
     return (
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
          <Image
        source={{ uri: `https://pub-c089cae46f7047e498ea7f80125058d5.r2.dev/${fileName}`}}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: moderateScale(8),
          resizeMode: "cover",
        }}
      />
        </S.Item>
      )}
      )
      }
    </S.Container>
  );
};