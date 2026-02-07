import React, { FC } from "react";

import { cloudflareBucketUrl } from "../../../globalVariables";
import Avatar from "../../../reusables/reviewCard/avatarCreator";

import * as S from "./styles";

interface RankingCardProps {
  item_id: number | string;
  label: string;
  avatar: string;
  item_count: number;
  onPress?: (item_id: number | string) => void;
}

export const RankingCard: FC<RankingCardProps> = ({ onPress, item_id, label, avatar, item_count }) => {

  const fileName = avatar?.split("/").pop();

  return (
    <S.RankingCard
      key={item_id}
      onPress={() => onPress?.(item_id)}
    >
      <Avatar photo={fileName && `${cloudflareBucketUrl}${fileName}`} defaultImage={"anchor"} />
      <S.CardSeparator>
        <S.Label>{label}</S.Label>
        <S.Label>{item_count}</S.Label>
      </S.CardSeparator>
    </S.RankingCard>
  );
};
