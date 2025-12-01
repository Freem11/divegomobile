import React from "react";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../styles";
import Icon, { IconName } from "../../../icons/Icon";

import * as S from "./styles";

type AvatarProps = {
  photo?: string;
  defaultImage?: string
};

function Avatar({ photo, defaultImage }: AvatarProps = {}) {
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
          name={defaultImage ? defaultImage as IconName : "user"}
          style={{ width: moderateScale(18), height: moderateScale(18) }}
          fill={colors.primaryBlue}
        />
      </S.StyledIcon>
    );
  }
}

export default Avatar;