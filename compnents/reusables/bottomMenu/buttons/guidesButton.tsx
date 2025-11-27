import React from "react";
import { TouchableOpacity } from "react-native";
import * as S from './styles';
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";

export default function GuidesButton() {

  return (
    <TouchableOpacity
      onPress={null}
    >
      <S.ButtonBox>
        <ButtonIcon
          icon="question-mark"
          onPress={() => null}
          size='icon'
          fillColor={colors.neutralGrey}
          title="Guides"
        />
      </S.ButtonBox>
    </TouchableOpacity>
  );
}