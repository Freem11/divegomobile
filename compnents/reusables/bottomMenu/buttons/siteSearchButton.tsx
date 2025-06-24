import React from "react";
import { TouchableOpacity } from "react-native";
import * as S from './styles';
import { useFeedScreenStore } from "../../../feed/store/useScreenStore";
import { FEED_SCREEN } from "../../../feed/store/types";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";

export default function SiteSearchButton() {
  const openScreen = useFeedScreenStore((state) => state.openScreen);
  const handlePress = () => {
    openScreen(FEED_SCREEN.FEED_MESSAGES)
  };

  return (
      <TouchableOpacity
        onPress={() => handlePress()}
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
