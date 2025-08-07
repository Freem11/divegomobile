import React, { FC, useContext, useMemo } from "react";
import { Dimensions } from "react-native";
import { moderateScale, scale } from "react-native-size-matters";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

import ImageCasherDynamic from "../../helpers/imageCashingDynamic";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { colors } from "../../styles";
import Icon from "../../../icons/Icon";
import { SelectedPhotoContext } from "../../contexts/selectedPhotoContext";
import { ActiveTutorialIDContext } from "../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

import * as S from "./styles";

interface PreviewGridProps {
  items: DiveSiteWithUserName[] | null;
  onAddSighting?: () => void;
}

export const PreviewGrid:FC<PreviewGridProps> = ({ items, onAddSighting }) => {
  const { setSelectedPhoto } = useContext(SelectedPhotoContext);
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext);
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  const screenWidth = Dimensions.get("window").width;
  const containerPadding = scale(20);
  const gap = scale(8);

  const { numColumns, itemSize } = useMemo(() => {
    const availableWidth = screenWidth - (containerPadding * 2);
    const columns = 3;
    const totalGaps = gap * (columns - 1);
    const size = (availableWidth - totalGaps) / columns;

    return { numColumns: columns, itemSize: size };
  }, [screenWidth, containerPadding, gap]);

  const togglePhotoBoxModal = (photo: string) => {
    setSelectedPhoto(photo);
    setFullScreenModal(true);
    setActiveTutorialID("PinchAndZoomPhoto");
  };

  return (
    <S.Wrapper>
      <S.Container>
        {items && items.length > 0 && items.slice(0,8).map((item, index) => (
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
            <TouchableWithoutFeedback onPress={() => togglePhotoBoxModal(item.photofile)}>
              <ImageCasherDynamic
                photoFile={item.photofile}
                style={{
                  height: "100%",
                  width: "100%",
                  borderRadius: moderateScale(8),
                  resizeMode: "cover",
                }}
              />
            </TouchableWithoutFeedback>
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
              width={moderateScale(22)}
              height={moderateScale(22)}
            />
            <S.AddSightingText>
              Add a Sighting
            </S.AddSightingText>
          </S.AddSightingButton>
        )}
      </S.Container>
    </S.Wrapper>
  );
};