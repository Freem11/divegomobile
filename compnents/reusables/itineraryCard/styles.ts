import styled from 'styled-components/native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
  buttonSizes
} from '../../styles';
import { Platform } from "react-native";
import Button from "../button";

export const Card = styled.View`
  border-color: ${colors.lightGrey};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(12)}px;
  width: 100%;
  margin-bottom: ${moderateScale(16)}px;
  padding: ${moderateScale(15)}px;
  ${Platform.select({
    ios: `
      shadow-color: #000;
      shadow-offset: 0px 1px;
      shadow-opacity: 0.1;
      shadow-radius: 2px;
    `,
    android: `
      elevation: 0;
    `,
  })}
`;

export const CardTop = styled.View`
  justify-content: space-between;
  margin-bottom: ${moderateScale(5)}px;
  width: 100%;
  gap: ${moderateScale(6)}px;
`;

export const Header = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Bold};
  text-wrap: pretty;
  flex: 1;
  margin-right: ${moderateScale(8)}px;
`;

export const Date = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Regular};
  color: ${colors.darkGrey};
`;

export const Price = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.themeGreen};
`;

export const Actions = styled.View`
  justify-content: space-between;
  align-items: center;
`;

export const Description = styled.View`
   flex-direction: column;
   width: 100%;
`;


export const DescriptionTextCollapsed = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular};
  flex-wrap: wrap;
  width: 90%;
  margin-top: ${moderateScale(10)}px;
`;

export const DescriptionTextExpanded = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Regular};
  flex-wrap: wrap;
  width: 90%;
  margin-top: ${moderateScale(10)}px;
`;

export const ShowMoreText = styled.Text`
  font-size: ${moderateScale(15)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.darkGrey};
  text-decoration: underline;
  text-decoration-color: ${colors.darkGrey};
  margin-top: ${moderateScale(10)}px;
`;

export const ButtonsContainer = styled.View`
  flex-direction: row;
  gap: ${moderateScale(8)}px;
  width: 100%;
  margin-top: ${moderateScale(20)}px;
`;

export const ButtonWrapper = styled.View`
  flex: 1;
`;

export const StyledButton = styled(Button)`
  width: 100%;
  height: ${moderateScale(40)}px;
`;