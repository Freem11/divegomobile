import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

import Label from "../../reusables/label";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import { PreviewGrid } from "../../reusables/previewGrid";

import * as S from "./styles";

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
  const [siteVals, setSiteVals] = useState(null);

  useEffect(() => {
    setSiteVals({
      siteName: selectedDiveSite.name,
      bio: selectedDiveSite.diveSiteBio,
      user: selectedDiveSite.newusername
    })
  
  },[selectedDiveSite])

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
          <S.Header>{siteVals?.siteName}</S.Header>

          <FontAwesome
            name="flag"
            color="maroon"
            size={moderateScale(16)}
            style={{ marginTop: "5%", marginLeft: moderateScale(10) }}
            onPress={() => handleEmailDS()}
          />
        </S.SiteNameContainer>

        <S.Contributor>Added by: {siteVals?.user}</S.Contributor>

        <S.Content>{siteVals?.bio}</S.Content>

      </S.InputGroupContainer>

      <S.LabelWrapper>
        <Label label="Sea Life Sightings" />
      </S.LabelWrapper>

      {groupedPhotos && Object.values(groupedPhotos).map((photoPacket, index) => {
        return (
          <S.PhotoContainer key={`${photoPacket.dateTaken}-${index}`}>
            {/*<S.PacketHeader>*/}
            {/*<S.HeaderWrapper>*/}
            {/*  <S.IconWrapper>*/}
            {/*    <Icon name={'calendar-month'} fill={colors.primaryBlue}/>*/}
            {/*  </S.IconWrapper>*/}
            {/*  <S.PacketHeaderItem>{photoPacket.dateTaken}</S.PacketHeaderItem>*/}
            {/*</S.HeaderWrapper>*/}
            {/*</S.PacketHeader>*/}
            <PreviewGrid items={photoPacket.photos}/>
            {/*{photoPacket.photos.length > 0 &&*/}
            {/*  photoPacket.photos.map((photo, index) => {       */}
            {/*    return (*/}
            {/*      <SeaLifeImageCard*/}
            {/*        key={`${photo.id}-${index}`}*/}
            {/*        pic={photo}*/}
            {/*        dataSetType={"DiveSitePhotos"}*/}
            {/*        profileViewAction={() => handleProfileMove(photo.UserName)}*/}
            {/*      />*/}
            {/*    );*/}
            {/*  })}*/}
          </S.PhotoContainer>
        );
      })}
    </S.ContentContainer>
  );
}

