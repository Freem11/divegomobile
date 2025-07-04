import React, { useEffect, useState } from "react";
import * as S from "./styles";
import { useTranslation } from "react-i18next";
import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Icon from "../../../icons/Icon";
import Label from "../../reusables/label";
import { Photo } from "../../../entities/photos";
import { colors } from "../../styles";
import { ActiveProfile } from "../../../entities/profile";


type UserProfileProps = {
  profilePhotos:  Photo[] | null;
  handleDiveSiteMove: (pic: Photo, photoPacket: any) => void;
  selectedProfile: ActiveProfile | null
};

export default function UserProfileScreenView({
  profilePhotos,
  handleDiveSiteMove,
  selectedProfile
}: UserProfileProps) {
  
  const { t } = useTranslation()
  const [profileVals, setProfileVals] = useState(null);

  useEffect(() => {
    setProfileVals({
      userName: selectedProfile?.UserName,
      bio: selectedProfile?.profileBio,
    })
  
  },[selectedProfile])

  const groupedPhotos = {};

  profilePhotos && profilePhotos.forEach(photo => {
    const key = `${photo.divesitename}_${photo.dateTaken}`;
    if (!groupedPhotos[key]) {
      groupedPhotos[key] = {
        divesitename: photo.divesitename,
        dateTaken: photo.dateTaken,
        photos: [],
      };
    }
    groupedPhotos[key].photos.push(photo);
  });

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.UserNameContainer>
          <S.Header>{profileVals?.userName}</S.Header>
        </S.UserNameContainer>
   
        <S.Content>{profileVals?.bio}</S.Content>

      </S.InputGroupContainer>

      <S.LabelWrapper>
            <Label label="Sea Life Sightings" />
        </S.LabelWrapper>
        
      {groupedPhotos && Object.values(groupedPhotos).map((photoPacket, index) => {
  return (
    <S.PhotoContainer key={`${photoPacket.id}-${index}`}>   
      <S.PacketHeader key={`${photoPacket.id}-${index}`}>
  
      <S.HeaderWrapper>
        <S.IconWrapper>
          <Icon name={'anchor'} fill={colors.primaryBlue}/>
        </S.IconWrapper>

          <S.PacketHeaderItem>{photoPacket.divesitename}</S.PacketHeaderItem>
      </S.HeaderWrapper>

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
              dataSetType={"ProfilePhotos"}
              diveSiteName={photoPacket.name}
              diveSiteAction={() => handleDiveSiteMove(photo, photoPacket)}
            />
          );
        })}
    </S.PhotoContainer>
  );
})}
    </S.ContentContainer>
  );
}
