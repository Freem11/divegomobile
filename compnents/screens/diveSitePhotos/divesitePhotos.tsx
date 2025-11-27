import React, { useContext } from "react";
import { FlatList } from "react-native";
import { useTranslation } from "react-i18next";

import ButtonIcon from "../../reusables/buttonIcon";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import { colors } from "../../styles";
import Icon from "../../../icons/Icon";
import { SelectedDiveSiteContext } from "../../contexts/selectedDiveSiteContext";

import * as S from "./styles";

type DiveSitePhotosPageViewProps = {
  diveSites: any
  title: string
  onClose: () => void
  handleProfileMove: (userName: string) => void;
};

export default function DiveSitePhotosPageView({
  diveSites,
  title,
  onClose,
  handleProfileMove
}: DiveSitePhotosPageViewProps) {

  const { t } = useTranslation();
  const { selectedDiveSite } = useContext(SelectedDiveSiteContext);

  return (
    <S.ContentContainer>

      <S.SafeArea>
        <S.BackButtonWrapper>
          <ButtonIcon
            icon="chevron-left"
            onPress={onClose}
            size="small"
            fillColor={"darkgrey"}
          />
        </S.BackButtonWrapper>

      </S.SafeArea>

      <S.Header>{title}</S.Header>

      <FlatList
        data={diveSites}
        keyExtractor={(item, index) => `diveSite-${item.id}-${item.dateTaken}-${index}`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        renderItem={({ item }) => (
          <S.PhotoContainer>
            <S.PacketHeader>
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
                  dataSetType={"DiveSitePhotos"}
                  profileViewAction={() => handleProfileMove(photo.UserName)}
                />
              )}
            />
          </S.PhotoContainer>
        )}
      />
    </S.ContentContainer>
  );

}