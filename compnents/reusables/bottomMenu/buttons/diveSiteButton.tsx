import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";
import * as S from './styles';
import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { LevelTwoScreenContext } from "../../../contexts/levelTwoScreenContext";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";

export default function DiveSiteButton() {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { levelTwoScreen, setLevelTwoScreen } = useContext(LevelTwoScreenContext);

  const handleScreen = () => {
    setActiveScreen("DiveSiteUploadScreen")
    setLevelTwoScreen(true)
  }

  return (
      <TouchableOpacity
        onPress={handleScreen}
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
