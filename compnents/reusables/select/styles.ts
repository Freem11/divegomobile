import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import {
  colors,
  fontSizes,
} from "../../styles";

export const Container = styled.View`
`;

export const Trigger = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding-top:  ${moderateScale(4)}px;
  border-color: ${colors.neutralGrey};
  border-bottom-width:  ${moderateScale(2)}px;
`;

export const IconLeft = styled.View`
  margin-right: ${moderateScale(6)}px;
  width: ${moderateScale(24)}px;
  height:${moderateScale(24)}px;
`;

export const TriggerContent = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

export const Input = styled.TextInput`
  flex: 1;
  min-width: 100;
  font-size: ${moderateScale(fontSizes.StandardText)};
`;

export const Arrow = styled.Text`
  margin-left: ${moderateScale(6)}px;
  font-size: ${moderateScale(fontSizes.SmallText)};
`;

export const DropdownWrapper = styled.View`
  margin-top:  ${moderateScale(4)}px;
`;
