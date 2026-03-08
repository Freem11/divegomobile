import React, { FC } from "react";

import Avatar from "../reviewCard/avatarCreator";
import { Image, IMAGE_SIZE } from "../../../entities/image";
import getImagePublicUrl from "../../helpers/getImagePublicUrl";

import * as S from "./styles";

interface DiveSiteCardProps {
  diveSiteId: number;
  diveSiteName: string;
  siteNumber?: number;
  diveSitePhoto?: Image;
  sitesArray?: number[]
  onPress?: (siteIdNo: number, siteList: number[]) => void;
}

export const DiveSitesCard: FC<DiveSiteCardProps> = ({ onPress, diveSiteId, diveSiteName, diveSitePhoto, sitesArray, siteNumber }) => {
  return (
    <S.DiveSitesCard
      key={diveSiteId}
      onPress={() => onPress?.(diveSiteId, sitesArray)}
    >
      {diveSitePhoto && <Avatar photo={getImagePublicUrl(diveSitePhoto, IMAGE_SIZE.SM)} defaultImage={"anchor"} />}
      {siteNumber && <S.SiteNumber><S.SiteLabel>{siteNumber}</S.SiteLabel></S.SiteNumber>}
      <S.Label>{diveSiteName}</S.Label>
    </S.DiveSitesCard>
  );
};