import React from "react";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";

import ButtonIcon from "../../reusables/buttonIcon";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import { colors } from "../../styles";
import Icon from "../../../icons/Icon";
import { Photo } from "../../../entities/photos";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";
import { SelectedProfileContext } from "../../contexts/selectedProfileModalContext";

import * as S from "./styles";

type UserProfilePhotosPageViewProps = {
  photos: any
  title: string
  onClose: () => void;
  handleDiveSiteMove: (pic: Photo, photoPacket: any) => void;
};

export default function UserProfilePhotosPageView({
  photos,
  title,
  onClose,
  handleDiveSiteMove
}: UserProfilePhotosPageViewProps) {

  const { t } = useTranslation();
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  return (
    <S.ContentContainer>

      <S.SafeArea>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={() => onClose()}
            size="small"
            fillColor={"darkgrey"}
          />
        </S.BackButtonWrapper>

      </S.SafeArea>

      <S.Header>{title}'s Sightings</S.Header>

      <FlatList
        data={photos}
        keyExtractor={(item, index) => `diveSite-${item.id}-${item.dateTaken}-${index}`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => (
          <S.PhotoContainer>
            <S.PacketHeader>
              <S.HeaderWrapper>
                <S.IconWrapper>
                  <Icon name={"anchor"} fill={colors.primaryBlue} />
                </S.IconWrapper>
                <S.PacketHeaderItem>{item.name}</S.PacketHeaderItem>
              </S.HeaderWrapper>
              <S.HeaderWrapper>
                <S.IconWrapper>
                  <Icon name={"calendar-month"} fill={colors.primaryBlue} />
                </S.IconWrapper>
                <S.PacketHeaderItem>{item.dateTaken}</S.PacketHeaderItem>
              </S.HeaderWrapper>
            </S.PacketHeader>

            <FlatList
              data={item.photos}
              keyExtractor={(photo, index) => `photo-${photo.id}-${item.dateTaken}-${index}`}
              scrollEnabled={false}
              renderItem={({ item: photo }) => (
                <SeaLifeImageCard
                  pic={photo}
                  dataSetType={"ProfilePhotos"}
                  diveSiteAction={() => handleDiveSiteMove(photo, item)}
                />
              )}
            />
          </S.PhotoContainer>
        )}
      />
    </S.ContentContainer>
  );
}