import React, { FC, useContext } from "react";
import { TouchableWithoutFeedback, View } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import {
  ScrollView,
  Gesture,
  GestureDetector,
  Pressable
} from "react-native-gesture-handler";

import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";
import ImageCasherDynamicLocal from "../../../helpers/imageCashingDynamicLocal";
import { useAppNavigation } from "../../../mapPage/types";
import { SelectedPhotoContext } from "../../../contexts/selectedPhotoContext";

import * as S from "./styles";

interface PhotoUploadProps {
  items: { photofile: string, id: number | null }[] | null;
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
  const navigation = useAppNavigation();
  const { setSelectedPhoto } = useContext(SelectedPhotoContext);

  const togglePhotoBoxModal = (photo: string) => {
    setSelectedPhoto(photo);
    navigation.navigate("PinchAndZoomPhoto");
  };

  const nativeGesture = Gesture.Native()
    .withRef(gestureRef)
    .shouldActivateOnStart(true)
    .shouldCancelWhenOutside(true);

  const renderPhotoItem = (item: { photofile: string }, index: number) => (
    <View style={{ position: "relative" }}>
      <S.Item style={{ width: itemSize, height: itemSize }}>
        <ImageCasherDynamicLocal
          photoFile={item.photofile}
          style={{ height: "100%", width: "100%", resizeMode: "cover" }}
        />
      </S.Item>
      {onRemovePhoto && (
        <Pressable
          onPress={() => onRemovePhoto(index)}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          style={{
            position: "absolute",
            top: moderateScale(4),
            right: moderateScale(4),
            zIndex: 9999,
          }}
        >
          <S.RemoveButton>
            <Icon name={"close"} color={"white"} width={moderateScale(16)} height={moderateScale(16)} />
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
          contentContainerStyle={{
            paddingRight: scale(16),
            flexDirection: "row",
            gap: scale(10),
          }}
        >
          {onAddSighting && (
            <Pressable
              onPress={onAddSighting}
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <S.AddSightingButton pointerEvents="none" style={{ width: itemSize, height: itemSize }}>
                <Icon name={"camera-plus"} color={colors.borderActive} width={moderateScale(40)} height={moderateScale(40)} />
              </S.AddSightingButton>
            </Pressable>
          )}

          {items?.map((item, index) => {
            const itemKey = `${item.photofile}-${index}`;

            return item.id ? (
              <TouchableWithoutFeedback
                key={itemKey}
                onPress={() => togglePhotoBoxModal(item.photofile)}
              >
                <View>{renderPhotoItem(item, index)}</View>
              </TouchableWithoutFeedback>
            ) : (
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