import React, { FC } from "react";

import Avatar from "../reviewCard/avatarCreator";
import { cloudflareBucketUrl } from "../../globalVariables";

import * as S from "./styles";

interface DiveSiteCardProps {
  diveSiteId: number;
  diveSiteName: string;
  diveSitePhoto: string;
  sitesArray: number[]
  onPress?: (siteIdNo: number, siteList: number[]) => void;
}

export const DiveSitesCard: FC<DiveSiteCardProps> = ({ onPress, diveSiteId, diveSiteName, diveSitePhoto, sitesArray }) => {

  const fileName = diveSitePhoto?.split("/").pop();

  return (
    <S.DiveSitesCard
      key={diveSiteId}
      onPress={() => onPress?.(diveSiteId, sitesArray)}
    >
      <Avatar photo={fileName && `${cloudflareBucketUrl}${fileName}`} defaultImage={"diving-scuba-flag"} />
      <S.Label>{diveSiteName}</S.Label>
    </S.DiveSitesCard>
  );
};
