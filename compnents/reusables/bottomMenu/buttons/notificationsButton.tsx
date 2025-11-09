import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { useFeedScreenStore } from "../../../feed/store/useScreenStore";
import { FEED_SCREEN } from "../../../feed/store/types";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";

import * as S from "./styles";
import { useNotificationsStore } from "../../../feed/store/useNotificationsStore";

export default function NotificationsButton() {
  const openScreen = useFeedScreenStore((state) => state.openScreen);
  const refreshCount = useNotificationsStore((s) => s.refreshCount);

  const count = useNotificationsStore((s) => s.count);

  const showBadge = count > 0;
  const label = count >= 100 ? "99+" : String(count);

  const handlePress = () => {
    openScreen(FEED_SCREEN.NOTIFICATIONS);
  };

  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  return (
    <TouchableOpacity onPress={() => handlePress()}>
      <S.ButtonBox>
        <ButtonIcon
          icon="bell-ring-outline"
          onPress={handlePress}
          size="icon"
          fillColor={colors.themeWhite}
          title="Notifications"
        />
      </S.ButtonBox>
      {showBadge && <BadgeText numberOfLines={1}>{label}</BadgeText>}
    </TouchableOpacity>
  );
}

export const ButtonBox = styled.View`
  position: relative;
`;

export const BadgeText = styled.Text`
  position: absolute;
  top: -26px;
  right: 21px;
  color: ${colors.themeRed};
  font-size: 18px;
  font-weight: 700;
`;
