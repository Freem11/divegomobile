import React, { useContext } from "react";
import { TouchableOpacity } from "react-native";

import { useActiveScreenStore } from "../../../../store/useActiveScreenStore";
import { LevelTwoScreenContext } from "../../../contexts/levelTwoScreenContext";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";
import { useUserProfile } from "../../../../store/user/useUserProfile";

import * as S from "./styles";

export default function ProfileButton() {
  const setActiveScreen = useActiveScreenStore((state) => state.setActiveScreen);
  const { setLevelTwoScreen } = useContext(LevelTwoScreenContext);
  const { userProfile } = useUserProfile();

  const handleScreen = () => {
    setActiveScreen("ProfileScreen", { id: userProfile?.id });
    setLevelTwoScreen(true);
  };

  return (
    <TouchableOpacity
      onPress={handleScreen}
    >
      <S.ButtonBox>
        <ButtonIcon
          icon="person"
          onPress={handleScreen}
          size="icon"
          fillColor={colors.themeWhite}
          title="Profile"
        />
      </S.ButtonBox>
    </TouchableOpacity>
  );
}

