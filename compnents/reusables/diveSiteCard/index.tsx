import React, { FC } from "react";

import Avatar from "../reviewCard/avatarCreator";

import * as S from "./styles";

interface DiveSiteCardProps {
  diveSiteId: number;
  diveSiteName: string;
  diveSitePhoto: string;
  onPress?: () => void;
}

export const DiveSitesCard: FC<DiveSiteCardProps> = ({ onPress, diveSiteId, diveSiteName, diveSitePhoto }) => {

  return (
    <S.DiveSitesCard
      key={diveSiteId}
      onPress={onPress}
    >
      <Avatar photo={diveSitePhoto} defaultImage={"diving-scuba-flag"} />
      <S.Label>{diveSiteName}</S.Label>
    </S.DiveSitesCard>
  );
};
