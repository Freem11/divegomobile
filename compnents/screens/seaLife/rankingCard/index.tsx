import React, { FC } from "react";

import { cloudflareBucketUrl } from "../../../globalVariables";
import Avatar from "../../../reusables/reviewCard/avatarCreator";
import { Image, IMAGE_SIZE } from "../../../../entities/image";
import getImagePublicUrl from "../../../helpers/getImagePublicUrl";

import * as S from "./styles";

interface RankingCardProps {
  item_id: number | string;
  label: string;
  avatar: Image;
  item_count: number;
  onPress?: (item_id: number | string) => void;
}

export const RankingCard: FC<RankingCardProps> = ({ onPress, item_id, label, avatar, item_count }) => {
  return (
    <S.RankingCard
      key={item_id}
      onPress={() => onPress?.(item_id)}
    >
      <Avatar photo={avatar && getImagePublicUrl(avatar, IMAGE_SIZE.SM)} defaultImage={"anchor"} />
      <S.CardSeparator>
        <S.Label>{label}</S.Label>
        <S.Label>{item_count}</S.Label>
      </S.CardSeparator>
    </S.RankingCard>
  );
};
