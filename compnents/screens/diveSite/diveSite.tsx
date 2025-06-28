import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from '../../styles';
import * as S from "./styles";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Label from "../../reusables/label";
import Icon from "../../../icons/Icon";
import { DiveSiteWithUserName } from "../../../entities/diveSite";

type DiveSiteProps = {
  bottomHitCount?: number;
  selectedDiveSite: DiveSiteWithUserName
  diveSitePics: DiveSiteWithUserName[]
  handleProfileMove: (userName: string) => void;
  handleEmailDS: () => void;
};

export default function DiveSiteScreenView({
  bottomHitCount,
  selectedDiveSite,
  diveSitePics,
  handleProfileMove,
  handleEmailDS
}: DiveSiteProps) {

  const { t } = useTranslation();

  const groupedPhotos = {};

  diveSitePics && diveSitePics.forEach(photo => {
    const key = `${photo.dateTaken}`;
    if (!groupedPhotos[key]) {
      groupedPhotos[key] = {
        dateTaken: photo.dateTaken,
        photos: [],
      };
    }
    groupedPhotos[key].photos.push(photo);
  });
  
  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.SiteNameContainer>
          <S.Header>{selectedDiveSite?.name}</S.Header>

          <FontAwesome
            name="flag"
            color="maroon"
            size={moderateScale(16)}
            style={{ marginTop: "5%", marginLeft: moderateScale(10) }}
            onPress={() => handleEmailDS()}
          />
        </S.SiteNameContainer>

        <S.Contributor>Added by: {selectedDiveSite?.newusername}</S.Contributor>

        <S.Content>{selectedDiveSite?.divesitebio}</S.Content>

      </S.InputGroupContainer>

      <S.LabelWrapper>
            <Label label="Sea Life Sightings" />
        </S.LabelWrapper>

      {groupedPhotos && Object.values(groupedPhotos).map((photoPacket, index) => {
  return (
    <S.PhotoContainer key={`${photoPacket.dateTaken}-${index}`}>   
      <S.PacketHeader key={`${photoPacket.dateTaken}-${index}`}>

      <S.HeaderWrapper>
        <S.IconWrapper>
        <Icon name={'calendar-month'} fill={colors.primaryBlue}/>
        </S.IconWrapper>

        <S.PacketHeaderItem>{photoPacket.dateTaken}</S.PacketHeaderItem>
      </S.HeaderWrapper>

      </S.PacketHeader>
      {photoPacket.photos.length > 0 &&
        photoPacket.photos.map((photo, index) => {       
          return (
            <SeaLifeImageCard
              key={`${photo.id}-${index}`}
              pic={photo}
              dataSetType={"DiveSitePhotos"}
              profileViewAction={() => handleProfileMove(photo.UserName)}
            />
          );
        })}
    </S.PhotoContainer>
  );
})}
    </S.ContentContainer>
  );
}

