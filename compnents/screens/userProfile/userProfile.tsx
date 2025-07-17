import React, { useEffect, useState } from "react";
import * as S from "./styles";
import Label from "../../reusables/label";
import { Photo } from "../../../entities/photos";
import { ActiveProfile } from "../../../entities/profile";
import Button from "../../reusables/button";

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
        
        <S.StatWrapper>
        <S.Stats>{sightingsCount} Sightings</S.Stats>
      </S.StatWrapper>

      <S.StatWrapper>
        <S.Stats>{speciesCount} Species Sighted</S.Stats>
      </S.StatWrapper>


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
