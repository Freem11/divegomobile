import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../styles";
import ButtonIcon from "../reusables/buttonIcon";
import { useFeedScreenStore } from "../feed/store/useScreenStore";
import { FEED_SCREEN } from "../feed/store/types";
import * as S from './styles';

export default function SiteSearchButton() {
  const [butState, setButState] = useState(false);
  const openScreen = useFeedScreenStore((state) => state.openScreen);
  const handlePress = () => {
    openScreen(FEED_SCREEN.FEED_MESSAGES)
  };

  return (
      <TouchableOpacity
        onPress={() => handlePress()}
        onPressIn={() => setButState(true)}
        onPressOut={() => setButState(false)}
      >
        <S.ButtonBox>
              <ButtonIcon 
                icon="dive-watch"
                onPress={handlePress}
                size='icon'
                fillColor={colors.themeWhite}
                title="Notifications"
              />
        </S.ButtonBox>
      </TouchableOpacity>
  );
}
