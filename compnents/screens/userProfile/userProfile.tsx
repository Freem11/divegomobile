import React, { useEffect, useState } from "react";

import { Photo } from "../../../entities/photos";
import { ActiveProfile } from "../../../entities/profile";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import SealifePreview from "../../reusables/sealifePreview";

import * as S from "./styles";

type UserProfileProps = {
  profilePhotos: DiveSiteWithUserName[] | null;
  handleDiveSiteMove: (pic: Photo, photoPacket: any) => void;
  selectedProfile: ActiveProfile | null;
  speciesCount: number;
  sightingsCount: number;
  openAllPhotosPage: () => void;
};

export default function UserProfileScreenView({
  profilePhotos,
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
        onAddSighting={openAllPhotosPage}
        selectedProfile={selectedProfile}
      />
    </S.ContentContainer>
  );
}
