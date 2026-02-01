import React, { FC, useMemo } from "react";
import { Dimensions, Pressable } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";

import ImageCasherDynamic from "../../helpers/imageCashingDynamic";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { colors } from "../../styles";
import Icon from "../../../icons/Icon";
import { useAppNavigation } from "../../mapPage/types";

import * as S from "./styles";

interface PreviewGridProps {
  items: DiveSiteWithUserName[] | null;
  onAddSighting?: () => void;
  buttonText: string
}

export const PreviewGrid: FC<PreviewGridProps> = ({ items, onAddSighting, buttonText }) => {
  const screenWidth = Dimensions.get("window").width;
  const containerPadding = scale(20);
  const gap = scale(8);

  const navigation = useAppNavigation();

  const { numColumns, itemSize } = useMemo(() => {
    const availableWidth = screenWidth - (containerPadding * 2);
    const columns = 3;
    const totalGaps = gap * (columns - 1);
    const size = (availableWidth - totalGaps) / columns;

    return { numColumns: columns, itemSize: size };
  }, [screenWidth, containerPadding, gap]);

  return (
    <S.Wrapper>
      <S.Container>
        {items && items.length > 0 && items.slice(0, 8).map((item, index) => (
          <S.Item
            key={index}
            style={{
              width: itemSize,
              height: itemSize,
              marginRight: (index + 1) % numColumns === 0 ? 0 : gap,
              marginBottom: gap,
              backgroundColor: colors.lightGrey,
            }}
          >
            <Pressable onPress={() => navigation.navigate("PinchAndZoomPhoto", { photoFile: `${item.public_domain}/${item.xl}` })}>
              <ImageCasherDynamic
                photoFile={item}
                size="sm"
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: moderateScale(8),
                  resizeMode: "cover",
                }}
                aspectRatio={0}
              />
            </Pressable>
          </S.Item>
        ))}
        {onAddSighting && (
          <S.AddSightingButton
            onPress={onAddSighting}
            style={{
              width: itemSize,
              height: itemSize,
              marginBottom: gap,
            }}
          >
            <Icon
              name={"camera-plus"}
              color={colors.primaryBlue}
              width={scale(22)}
              height={scale(22)}
            />
            <S.AddSightingText>
              {buttonText}
            </S.AddSightingText>
          </S.AddSightingButton>
        )}
      </S.Container>
    </S.Wrapper>
  );
};