import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import { screenSecondaryButton, buttonTextAlt } from '../styles';

export const SecondaryButton = styled.View`
  ${screenSecondaryButton};
  flex-direction: row;
`;

export const SecondaryButtonText = styled.Text`
  ${buttonTextAlt};
  margin-horizontal: ${moderateScale(5)}px;
`;