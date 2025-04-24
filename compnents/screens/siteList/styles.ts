import styled from 'styled-components/native';
import { colors } from "../../styles";
import { moderateScale } from 'react-native-size-matters'

export const ScrollViewContainer = styled.View`
    width: 100%; 
    marginTop: 12%; 
    marginBottom: 1%;
`;

export const ListItemContainer = styled.View`
  width: 94%;
  margin-left: 3%;
  margin-vertical: ${moderateScale(4)}px;
`;

export const ItemHousing = styled.View`
  padding-bottom: ${moderateScale(24)}px;
`;

export const ButtonHousing = styled.View`
  position: absolute;
  bottom: ${moderateScale(20)}px;
  right: ${moderateScale(20)}px;
`

export const VerticalLine = styled.View`
  position: absolute;
  top: ${moderateScale(49)}px;
  left: ${moderateScale(24.5)}px;
  bottom: ${moderateScale(-10)}px;
  width: ${moderateScale(2)}px;
  background-color: ${colors.neutralGrey};
`;
