import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import { colors } from "../styles";

export const ButtonBox = styled.View`
    align-items: center;
    justify-content: center;
    background-color: ${colors.primaryBlue};
    width: ${moderateScale(80)}px;
    height: ${moderateScale(55)}px;
`;

