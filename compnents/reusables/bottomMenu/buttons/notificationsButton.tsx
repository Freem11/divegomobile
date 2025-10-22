import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { useFeedScreenStore } from "../../../feed/store/useScreenStore";
import { FEED_SCREEN } from "../../../feed/store/types";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";

import * as S from "./styles";
import { useNotificationsStore } from "../../../feed/store/useNotificationsStore";

type NotificationsButtonProps = {
  count: number;
};

export default function NotificationsButton({ count }: NotificationsButtonProps) {
  const openScreen = useFeedScreenStore((state) => state.openScreen);

  const count1 = useNotificationsStore((s) => s.count);
  console.log("NotificationsButton count from store:", count1);
//const label = count >= 100 ? "99+" : String(count);

  const showBadge = count > 0;
  const label = count >= 100 ? "99+" : String(count);

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
