import React, { FC } from "react";

import Avatar from "../reviewCard/avatarCreator";
import { Image, IMAGE_SIZE } from "../../../entities/image";
import getImagePublicUrl from "../../helpers/getImagePublicUrl";

import * as S from "./styles";

interface DiveSiteCardProps {
  diveSiteId: number;
  diveSiteName: string;
  diveSitePhoto: Image;
  sitesArray: number[]
  onPress?: (siteIdNo: number, siteList: number[]) => void;
}

export const DiveSitesCard: FC<DiveSiteCardProps> = ({ onPress, diveSiteId, diveSiteName, diveSitePhoto, sitesArray }) => {

  return (
    <S.DiveSitesCard
      key={diveSiteId}
      onPress={() => onPress?.(diveSiteId, sitesArray)}
    >
      <Avatar photo={diveSitePhoto && getImagePublicUrl(diveSitePhoto, IMAGE_SIZE.SM)} defaultImage={"anchor"} />
      <S.Label>{diveSiteName}</S.Label>
    </S.DiveSitesCard>
  );
};
