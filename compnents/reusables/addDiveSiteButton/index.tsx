import React, { FC } from "react";

import Avatar from "../reviewCard/avatarCreator";

import * as S from "./styles";

interface DiveSiteCardProps {
  diveSiteId: number;
  diveSiteName: string;
  diveSitePhoto: string;
  sitesArray: number[]
  onPress?: (siteIdNo: number, siteList: number[]) => void;
}

export const DiveSitesCard: FC<DiveSiteCardProps> = ({ onPress, diveSiteId, diveSiteName, diveSitePhoto, sitesArray }) => {

  return (
    <S.DiveSitesCard
      key={diveSiteId}
      onPress={() => onPress?.(diveSiteId, sitesArray)}
    >
      <Avatar photo={diveSitePhoto && diveSitePhoto} defaultImage={"anchor"} />
      <S.Label>{diveSiteName}</S.Label>
    </S.DiveSitesCard>
  );
};
