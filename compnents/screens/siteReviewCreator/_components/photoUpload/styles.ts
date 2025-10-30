import styled from 'styled-components/native'
import { moderateScale } from 'react-native-size-matters'
import { colors } from "../../../../styles";

export const Wrapper = styled.View`
  width: 100%;
  margin-top: ${moderateScale(4)}px;
`;

export const Item = styled.View`
  overflow: hidden;
`;

export const AddSightingButton = styled.TouchableOpacity`
  overflow: hidden;
  background: ${colors.lighterBlue};
  align-items: center;
  justify-content: center;
`;

export const RemoveButton = styled.TouchableOpacity`
  position: absolute;
  top: ${moderateScale(4)}px;
  right: ${moderateScale(4)}px;
  width: ${moderateScale(24)}px;
  height: ${moderateScale(24)}px;
  border-radius: ${moderateScale(12)}px;
  background-color: rgba(0, 0, 0, 0.4);
  align-items: center;
  justify-content: center;
  z-index: 10;
`;
