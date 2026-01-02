import { moderateScale, scale } from "react-native-size-matters";
import React, { FC, useContext } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { Gesture, GestureDetector, ScrollView } from "react-native-gesture-handler";

import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";
import ImageCasherDynamicLocal from "../../../helpers/imageCashingDynamicLocal";
import { DrawerGestureContext } from "../../../reusables/parallaxDrawer";

import * as S from "./styles";

interface PhotoUploadProps {
  items: DiveSiteWithUserName[] | null;
  onAddSighting?: () => void;
  onRemovePhoto?: (index: number) => void;
}

export const PhotoUpload: FC<PhotoUploadProps & { gestureRef: any }> = ({ gestureRef, items, onAddSighting, onRemovePhoto }) => {
  const itemSize = scale(100);
  const nativeGesture = Gesture.Native()
    .withRef(gestureRef)
    .shouldActivateOnStart(true);

  return (
    <S.Wrapper>
      <GestureDetector gesture={nativeGesture}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          nestedScrollEnabled={true}
          disallowInterruption={true}
          pagingEnabled={false}
          directionalLockEnabled={true}
          contentContainerStyle={{
            paddingRight: scale(16),
            gap: scale(1),
          }}
        >
          {onAddSighting && (
            <S.AddSightingButton
              onPress={onAddSighting}
              style={{
                width: itemSize,
                height: itemSize,
              }}
            >
              <Icon
                name={"camera-plus"}
                color={colors.borderActive}
                width={moderateScale(40)}
                height={moderateScale(40)}
              />
            </S.AddSightingButton>
          )}
          {items && items.length > 0 && items.map((item, index) => (
            <S.Item
              key={index}
              style={{
                width: itemSize,
                height: itemSize,
                backgroundColor: colors.lightGrey,
              }}
            >
              <TouchableWithoutFeedback>
                <ImageCasherDynamicLocal
                  photoFile={item.photofile}
                  style={{
                    height: "100%",
                    width: "100%",
                    resizeMode: "cover",
                  }}
                />
              </TouchableWithoutFeedback>
              {onRemovePhoto && (
                <S.RemoveButton onPress={() => onRemovePhoto(index)}>
                  <Icon
                    name={"close"}
                    color={"white"}
                    width={moderateScale(16)}
                    height={moderateScale(16)}
                  />
                </S.RemoveButton>
              )}
            </S.Item>
          ))}
        </ScrollView>
      </GestureDetector>
    </S.Wrapper>
  );
};
