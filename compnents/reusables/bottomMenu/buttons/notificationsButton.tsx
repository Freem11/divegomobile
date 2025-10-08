import React, { useContext, useMemo } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import * as S from "./styles";
import { useFeedScreenStore } from "../../../feed/store/useScreenStore";
import { FEED_SCREEN } from "../../../feed/store/types";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";
import { NotificationsFeedContext } from "../../../contexts/notificationsFeedContext";

export default function NotificationsButton() {
  const openScreen = useFeedScreenStore((state) => state.openScreen);
  const { notifications } = useContext(NotificationsFeedContext);
  const showBadge = notifications.length > 0;
  const label = useMemo(
    () => (notifications.length > 99 ? "99+" : String(notifications.length)),
    [notifications.length]
  );
  const handlePress = () => {
    openScreen(FEED_SCREEN.FEED_MESSAGES);
  };

  return (
    <TouchableOpacity onPress={() => handlePress()}>
      <S.ButtonBox>
        <ButtonIcon
          icon="dive-watch"
          onPress={handlePress}
          size="icon"
          fillColor={colors.themeWhite}
          title="Notifications"
        />
        {showBadge && <BadgeText numberOfLines={1}>{label}</BadgeText>}
      </S.ButtonBox>
    </TouchableOpacity>
  );
}

export const ButtonBox = styled.View`
  position: relative;
`;

export const BadgeText = styled.Text`
  position: absolute;
  top: -26px;
  right: 24px;
  color: ${colors.themeRed};
  font-size: 18px;
  font-weight: 700;
`;
