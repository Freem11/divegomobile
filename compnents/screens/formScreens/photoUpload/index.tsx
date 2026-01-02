import React, { FC } from "react";
import { View } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import {
  ScrollView,
  Gesture,
  GestureDetector,
  TouchableOpacity, // Use this version for better Android hit testing
  Pressable
} from "react-native-gesture-handler";

import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";
import ImageCasherDynamicLocal from "../../../helpers/imageCashingDynamicLocal";

import * as S from "./styles";

interface PhotoUploadProps {
  items: { photofile: string }[] | null;
  onAddSighting?: () => void;
  onRemovePhoto?: (index: number) => void;
  gestureRef?: any;
}

export const PhotoUpload: FC<PhotoUploadProps> = ({
  items,
  onAddSighting,
  onRemovePhoto,
  gestureRef
}) => {
  const itemSize = scale(100);

  // Link to the parent (Bottom Sheet) but allow children to activate
  const nativeGesture = Gesture.Native()
    .withRef(gestureRef)
    .shouldActivateOnStart(true)
    .shouldCancelWhenOutside(true);

  return (
    <S.Wrapper>
      <GestureDetector gesture={nativeGesture}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}
          // Critical for Android: allows buttons to finish their click
          disallowInterruption={false}
          contentContainerStyle={{
            paddingRight: scale(16),
            flexDirection: "row",
            gap: scale(10),
          }}
        >
          {onAddSighting && (
            <TouchableOpacity
              onPress={() => {
                console.log("Add Photo Clicked");
                onAddSighting();
              }}
              activeOpacity={0.6}
            >
              <S.AddSightingButton
                pointerEvents="none" // Lets the Touchable handle the tap
                style={{ width: itemSize, height: itemSize }}
              >
                <Icon
                  name={"camera-plus"}
                  color={colors.borderActive}
                  width={moderateScale(40)}
                  height={moderateScale(40)}
                />
              </S.AddSightingButton>
            </TouchableOpacity>
          )}

          {items?.map((item, index) => (
            <View key={`${item.photofile}-${index}`} style={{ position: "relative" }}>
              <S.Item style={{ width: itemSize, height: itemSize }}>
                <ImageCasherDynamicLocal
                  photoFile={item.photofile}
                  style={{
                    height: "100%",
                    width: "100%",
                    resizeMode: "cover",
                  }}
                />
              </S.Item>

              {onRemovePhoto && (
                <Pressable
                  onPress={() => {
                    console.log("Remove Photo Clicked index:", index);
                    onRemovePhoto(index);
                  }}
                  hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
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
          ))}
        </ScrollView>
      </GestureDetector>
    </S.Wrapper>
  );
};