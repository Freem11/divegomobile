import { moderateScale } from "react-native-size-matters";
import React, { FC } from "react";

import Icon from "../../../../icons/Icon";
import { colors } from "../../../styles";
import { Explainer } from "../explainer";

import * as S from "./styles";

interface CloneTripButtonProps {
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>
}

export const CloneTripButton: FC<CloneTripButtonProps> = ({ setEditMode }) => {

  const popoverContent = () => {
    return (
      <S.PopOver>
        <S.PopOverText>
          The Clone Trip button will make a copy of your existing trip to serve as a new one.
          {"\n"}
          {"\n"}
          This will make creating new trips faster when you have recurring ones!
        </S.PopOverText>
      </S.PopOver>
    );
  };

  return (
    <>
      <S.CloneTripButton
        onPress={() => setEditMode && setEditMode(false)}
      >
        <Icon
          name={"diving-scuba-double"}
          color={colors.borderActive}
          width={moderateScale(35)}
          height={moderateScale(35)}
        />
        <S.Label>Clone This Trip</S.Label>
      </S.CloneTripButton>
      <Explainer popoverContent={popoverContent} />
    </>
  );
};