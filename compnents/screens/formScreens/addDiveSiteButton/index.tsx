import { moderateScale, scale } from "react-native-size-matters";
import React, { FC } from "react";

import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";

import * as S from "./styles";

interface AddSitesButtonProps {
  onAddSites?: () => void;
}

export const AddSitesButton: FC<AddSitesButtonProps> = ({ onAddSites }) => {

  return (
    <S.AddDiveSitesButton
      onPress={onAddSites}
    >
      <Icon
        name={"anchor-plus"}
        color={colors.borderActive}
        width={moderateScale(40)}
        height={moderateScale(40)}
      />
      <S.Label>Add Dive Sites</S.Label>
    </S.AddDiveSitesButton>
  );
};
