import { moderateScale, scale } from "react-native-size-matters";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import React, { FC, useContext } from "react";
import { ScrollView } from "react-native";

import { DiveSiteWithUserName } from "../../../../entities/diveSite";
import { SelectedPhotoContext } from "../../../contexts/selectedPhotoContext";
import { ActiveTutorialIDContext } from "../../../contexts/activeTutorialIDContext";
import { FullScreenModalContext } from "../../../contexts/fullScreenModalContext";
import ImageCasherDynamic from "../../../helpers/imageCashingDynamic";
import Icon from "../../../../icons/Icon";
import { colors} from "../../../styles";

import * as S from "./styles";

interface PhotoUploadProps {
  items: DiveSiteWithUserName[] | null;
  onAddSighting?: () => void;
}

export const PhotoUpload:FC<PhotoUploadProps> = ({ items, onAddSighting }) => {
  const { setSelectedPhoto } = useContext(SelectedPhotoContext) as any;
  const { setActiveTutorialID } = useContext(ActiveTutorialIDContext) as any;
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  const itemSize = scale(110);

  const togglePhotoBoxModal = (photo: string) => {
    setSelectedPhoto(photo);
    setFullScreenModal(true);
    setActiveTutorialID('PinchAndZoomPhoto');
  };

  return (
    <S.Wrapper>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: scale(16),
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
              name={'camera-plus'}
              color={colors.borderActive}
              width={moderateScale(32)}
              height={moderateScale(32)}
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
            <TouchableWithoutFeedback onPress={() => togglePhotoBoxModal(item.photofile)}>
              <ImageCasherDynamic
                photoFile={item.photofile}
                style={{
                  height: '100%',
                  width: '100%',
                  resizeMode: 'cover',
                }}
              />
            </TouchableWithoutFeedback>
          </S.Item>
        ))}
      </ScrollView>
    </S.Wrapper>
  );
};