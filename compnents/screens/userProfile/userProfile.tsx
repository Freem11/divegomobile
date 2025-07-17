import React, { useEffect, useState } from "react";

import SeaLifeImageCard from "../../reusables/seaLifeImageCard/seaLifeImageCard";
import Icon from "../../../icons/Icon";
import Label from "../../reusables/label-new";
import { Photo } from "../../../entities/photos";
import { ActiveProfile } from "../../../entities/profile";
import Button from "../../reusables/button";

import * as S from "./styles";

type UserProfileProps = {
  profilePhotos:  Photo[] | null;
  handleDiveSiteMove: (pic: Photo, photoPacket: any) => void;
  selectedProfile: ActiveProfile | null;
  speciesCount: number;
  sightingsCount: number;
  openAllPhotosPage: () => void;
};

export default function UserProfileScreenView({
  profilePhotos,
  handleDiveSiteMove,
  selectedProfile,
  speciesCount,
  sightingsCount,
  openAllPhotosPage
}: UserProfileProps) {
  
  const [profileVals, setProfileVals] = useState(null);

  useEffect(() => {
    setProfileVals({
      userName: selectedProfile?.UserName,
      bio: selectedProfile?.profileBio,
    })

  },[selectedProfile])

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
                  <Icon name={"anchor"} fill={colors.primaryBlue}/>
                </S.IconWrapper>
                <S.PacketHeaderItem>{photoPacket.divesitename}</S.PacketHeaderItem>
              </S.HeaderWrapper>
              <S.HeaderWrapper>
                <S.PacketHeaderDate>{photoPacket.dateTaken}</S.PacketHeaderDate>
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
      <S.ButtonWrapper>
        <Button
          onPress={() => openAllPhotosPage()}
          alt={false}
          size='thin'
          title={'View All'}
        />
      </S.ButtonWrapper>
    </S.ContentContainer>
  );
}
