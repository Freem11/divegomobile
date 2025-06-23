import React, { useState, useContext } from "react";
import { TouchableOpacity } from "react-native";
import { LevelOneScreenContext } from '../contexts/levelOneScreenContext';
import { colors } from "../styles";
import { useActiveScreenStore } from "../../store/useActiveScreenStore";
import { UserProfileContext } from "../contexts/userProfileContext";
import ButtonIcon from "../reusables/buttonIcon";
import * as S from './styles';

export default function ItineraryListButton() {
  const [butState, setButState] = useState(false);
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);

  const { profile } = useContext(UserProfileContext);
  const { levelOneScreen, setLevelOneScreen } = useContext(LevelOneScreenContext);

  const handleScreen = () => {
    setActiveScreen("TripListScreen", {id: profile?.id})
    setLevelOneScreen(true)
  }

  return (
      <TouchableOpacity
        onPress={handleScreen}
        onPressIn={() => setButState(true)}
        onPressOut={() => setButState(false)}
      >
        <S.ButtonBox>
              <ButtonIcon 
                icon="diving-scuba-flag"
                onPress={handleScreen}
                size='icon'
                fillColor={colors.themeWhite}
                title="Trip Creator"
              />
        </S.ButtonBox>
      </TouchableOpacity>
  );
}