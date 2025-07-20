import React, { useEffect, useState } from "react";

import { Photo } from "../../../entities/photos";
import { ActiveProfile } from "../../../entities/profile";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import SealifePreview from "../../reusables/sealifePreview";

import * as S from "./styles";
import { useActiveScreenStore } from "../../../store/useActiveScreenStore";

type UserProfileProps = {
  profilePhotos: DiveSiteWithUserName[] | null;
  handleDiveSiteMove: (pic: Photo, photoPacket: any) => void;
  selectedProfile: ActiveProfile | null;
  speciesCount: number;
  sightingsCount: number;
  openAllPhotosPage: () => void;
  setLevelThreeScreen: React.Dispatch<React.SetStateAction<boolean>>
};

export default function UserProfileScreenView({
  profilePhotos,
  selectedProfile,
  speciesCount,
  sightingsCount,
  openAllPhotosPage,
  setLevelThreeScreen
}: UserProfileProps) {

  const [profileVals, setProfileVals] = useState(null);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  
  useEffect(() => {
    setProfileVals({
      userName: selectedProfile?.UserName,
      bio: selectedProfile?.profileBio,
    });

  },[selectedProfile]);

  return (
    <S.ContentContainer>
      <S.InputGroupContainer>
        <S.Header>{profileVals?.userName}</S.Header>
        <S.Content>{profileVals?.bio}</S.Content>
      </S.InputGroupContainer>

      <SealifePreview
        speciesCount={speciesCount}
        sightingsCount={sightingsCount}
        diveSitePics={profilePhotos}
        onViewMore={openAllPhotosPage}
        selectedProfile={selectedProfile}
      />
    </S.ContentContainer>
  );
}
