import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { LevelTwoScreenContext } from '../contexts/levelTwoScreenContext';
import { colors } from "../styles";
import { useActiveScreenStore } from "../../store/useActiveScreenStore";
import ButtonIcon from "../reusables/buttonIcon";
import * as S from './styles';

export default function DiveSiteButton() {
  const [butState, setButState] = useState(false);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { levelTwoScreen, setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const handleScreen = () => {
    setActiveScreen("DiveSiteUploadScreen")
    setLevelTwoScreen(true)
  }

  return (
      <TouchableOpacity
        onPress={handleScreen}
        onPressIn={() => setButState(true)}
        onPressOut={() => setButState(false)}
      >
        <S.ButtonBox>
              <ButtonIcon 
                icon="anchor-plus"
                onPress={handleScreen}
                size='icon'
                fillColor={colors.themeWhite}
                title="Site Add"
              />
        </S.ButtonBox>
      </TouchableOpacity>
  );
}
