import React, { FC } from "react";
import { View } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import {
  ScrollView,
  Gesture,
  GestureDetector,
  Pressable,
} from "react-native-gesture-handler";

import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";
import { useAppNavigation } from "../../../mapPage/types";
import { PHOTO_SIZES, PhotoVariantSet } from "../../../../entities/photoSizes";
import FadeInImage from "../../../reusables/fadeInImage/fadeInImage";

import * as S from "./styles";

interface PhotoUploadProps {
  items: PhotoVariantSet[];
  onAddSighting?: () => void;
  onRemovePhoto?: (index: number) => void;
  gestureRef?: any;
}

export const PhotoUpload: FC<PhotoUploadProps> = ({
  items,
  onAddSighting,
  onRemovePhoto,
  gestureRef,
}) => {
  const itemSize = scale(100);
  const navigation = useAppNavigation();

  const nativeGesture = Gesture.Native()
    .withRef(gestureRef)
    .shouldActivateOnStart(true)
    .shouldCancelWhenOutside(true);

  const renderPhotoItem = (item: PhotoVariantSet, index: number) => (
    <View style={{ position: "relative" }} pointerEvents="box-none">
      <S.Item style={{ width: itemSize, height: itemSize }}>
        <FadeInImage
          photoFile={{ "original_image": item.original_image, "public_domain": item.public_domain, "sm": item.sm, "md": item.md, "lg": item.lg, "xl": item.xl }}
          style={{ height: "100%", width: "100%", resizeMode: "cover" }}
          size={PHOTO_SIZES.Medium}
        />
      </S.Item>

      {onRemovePhoto && (
        <Pressable
          onPress={() => onRemovePhoto(index)}
          hitSlop={15}
          style={{
            position: "absolute",
            top: moderateScale(4),
            right: moderateScale(4),
            zIndex: 9999,
          }}
        >
          <S.RemoveButton>
            <Icon
              name={"close"}
              color={"white"}
              width={moderateScale(16)}
              height={moderateScale(16)}
            />
          </S.RemoveButton>
        </Pressable>
      )}
    </View>
  );

  return (
    <S.Wrapper>
      <GestureDetector gesture={nativeGesture}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          disallowInterruption={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingRight: scale(16),
            flexDirection: "row",
            gap: scale(10),
          }}
        >
          {onAddSighting && (
            <Pressable
              onPress={onAddSighting}
              hitSlop={5}
              style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
            >
              <S.AddSightingButton
                pointerEvents="none"
                style={{ width: itemSize, height: itemSize }}
              >
                <Icon
                  name={"camera-plus"}
                  color={colors.borderActive}
                  width={moderateScale(40)}
                  height={moderateScale(40)}
                />
              </S.AddSightingButton>
            </Pressable>
          )}

          {items?.map((item, index) => {
            const itemKey = `${item.sm}-${index}`;

            if (item.id) {
              return (
                <Pressable
                  key={itemKey}
                  onPress={() =>
                    navigation.navigate("PinchAndZoomPhoto", {
                      photoFile: item.photofileZoom,
                    })}
                  hitSlop={10}
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      transform: [{ scale: pressed ? 0.99 : 1 }],
                    },
                  ]}
                >
                  {renderPhotoItem(item, index)}
                </Pressable>
              );
            }

            return (
              <View key={itemKey}>
                {renderPhotoItem(item, index)}
              </View>
            );
          })}
        </ScrollView>
      </GestureDetector>
    </S.Wrapper>
  );
};