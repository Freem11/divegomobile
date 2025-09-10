import React from "react";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../styles";
import Icon from "../../../icons/Icon";

import * as S from "./styles";

type AvatarProps = {
  photo?: string;
};

function Avatar({ photo }: AvatarProps = {}) {
  if (photo) {
    return (
      <S.StyledImage
        source={{ uri: photo }}
        contentFit="cover"
        transition={1000}
      />
    );
  } else {
    return (
      <S.StyledIcon>
        <Icon
          name={"user"}
          style={{ width: moderateScale(32), height: moderateScale(32) }}
          fill={colors.neutralGrey}
        />
      </S.StyledIcon>
    );
  }
}

export default Avatar;