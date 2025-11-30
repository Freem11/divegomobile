import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

import { useFeedScreenStore } from "../../../feed/store/useScreenStore";
import { FEED_SCREEN } from "../../../feed/store/types";
import ButtonIcon from "../../buttonIcon";
import { colors } from "../../../styles";

import * as S from "./styles";

export default function NotificationsButton({ countProps }: { countProps: number }) {
  const openScreen = useFeedScreenStore((state) => state.openScreen);
  const showBadge = countProps > 0;
  const label = countProps >= 100 ? "99+" : String(countProps);

  const handlePress = () => {
    openScreen(FEED_SCREEN.NOTIFICATIONS);
  };

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
