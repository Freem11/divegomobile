import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { ActiveScreenContext } from '../contexts/activeScreenContext';
import { colors } from "../styles";
import ButtonIcon from "../reusables/buttonIcon";
import * as S from './styles';

export default function GuidesButton() {
  const [butState, setButState] = useState(false);
  const { activeScreen, setActiveScreen } = useContext(ActiveScreenContext);

  const handleScreen = () => {
  }

  return (
      <TouchableOpacity
        onPress={null}
        // onPressIn={() => setButState(true)}
        // onPressOut={() => setButState(false)}
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