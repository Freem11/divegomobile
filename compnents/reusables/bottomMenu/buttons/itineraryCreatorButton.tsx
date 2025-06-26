import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import * as S from './styles';
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";
import { LevelOneScreenContext } from "../../../contexts/levelOneScreenContext";
import { UserProfileContext } from "../../../contexts/userProfileContext";

export default function ItineraryListButton() {
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
      >
        <S.ButtonBox>
              <ButtonIcon 
                icon="diving-scuba-flag"
                onPress={handleScreen}
                size='icon'
                fillColor={colors.themeWhite}
                title="My Centers"
              />
        </S.ButtonBox>
      </TouchableOpacity>
  );
}