import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { colors } from '../../styles';
import * as S from "./styles";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Label from "../../reusables/label";
import Icon from "../../../icons/Icon";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import Button from "../../reusables/button";

type DiveSiteProps = {
  bottomHitCount?: number;
  selectedDiveSite: DiveSiteWithUserName
  diveSitePics: DiveSiteWithUserName[]
  handleProfileMove: (userName: string) => void;
  handleEmailDS: () => void;
  speciesCount: number;
  sightingsCount: number;
  tripCount: number;
  openPicUploader: () => void;
  openAllPhotosPage: () => void;
};

export default function DiveSiteScreenView({
  bottomHitCount,
  selectedDiveSite,
  diveSitePics,
  handleProfileMove,
  handleEmailDS,
  speciesCount,
  sightingsCount,
  tripCount,
  openPicUploader,
  openAllPhotosPage
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

      <S.StatWrapper>
        <S.Stats>{sightingsCount} Sightings</S.Stats>
      </S.StatWrapper>

      <S.StatWrapper>
        <S.Stats>{speciesCount} Species Sighted</S.Stats>
      </S.StatWrapper>

      <S.ButtonWrapper>

          <Button 
            onPress={() => openPicUploader()} 
            alt={false} 
            size='thin'
            title={t('DiveSite.addSighting')} 
            />

          <Button 
            onPress={() => openAllPhotosPage()} 
            alt={false} 
            size='thin'
            title={'View All'} 
            />

      </S.ButtonWrapper>

      <S.LabelWrapper>
        <Label label="Dive Trips" />
      </S.LabelWrapper>

      <S.StatWrapper>
        <S.Stats>{tripCount} Active Trips</S.Stats>
      </S.StatWrapper>

<S.ButtonWrapper>
      <Button 
            onPress={null} 
            alt={false} 
            size='thin'
            title={'View All'} 
            />
</S.ButtonWrapper>
    </S.ContentContainer>
  );
}

