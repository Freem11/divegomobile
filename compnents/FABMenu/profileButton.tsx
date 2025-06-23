import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { useActiveScreenStore } from "../../store/useActiveScreenStore";
import { LevelTwoScreenContext } from '../contexts/levelTwoScreenContext';
import { colors } from "../styles";
import { UserProfileContext } from "../contexts/userProfileContext";
import ButtonIcon from "../reusables/buttonIcon";
import * as S from './styles';

export default function ProfileButton() {
  const [butState, setButState] = useState(false);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { levelTwoScreen, setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const { profile } = useContext(UserProfileContext);

  const handleScreen = () => {
    setActiveScreen("ProfileScreen", {id: profile?.id})
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
                icon="person"
                onPress={handleScreen}
                size='icon'
                fillColor={colors.themeWhite}
                title="Profile"
              />
        </S.ButtonBox>
      </TouchableOpacity>
  );
}

