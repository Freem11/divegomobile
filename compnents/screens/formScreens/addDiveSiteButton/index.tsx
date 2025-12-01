import { moderateScale } from "react-native-size-matters";
import React, { FC } from "react";

import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";
import { Form } from "../tripCreator/form";

import * as S from "./styles";

interface AddSitesButtonProps {
  onAddSites?: (formData: Required<Form>) => void;
  formValues: Required<Form>
}

export const AddSitesButton: FC<AddSitesButtonProps> = ({ onAddSites, formValues }) => {

  return (
    <S.AddDiveSitesButton
      onPress={() => onAddSites(formValues)}
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
