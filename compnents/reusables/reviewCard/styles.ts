import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { Platform } from "react-native";
import { Image } from "expo-image";

import { colors, fontSizes, activeFonts } from "../../styles";
import Button from "../button";

export const StyledImage = styled(Image)`
  width: ${moderateScale(45)}px;
  height: ${moderateScale(45)}px;
  borderRadius: ${moderateScale(45)}px;
  marginRight: ${moderateScale(10)}px;
  resizeMode: cover;
`;

export const StyledIcon = styled.View`
  backgroundColor: ${colors.lightGrey};
  width: ${moderateScale(45)}px;
  height: ${moderateScale(45)}px;
  borderRadius: ${moderateScale(24)}px;
  alignItems: center;
  justifyContent: center; 
  marginRight: ${moderateScale(10)}px;
`;

export const Card = styled.View`
  border-color: ${colors.lightGrey};
  border-width: ${moderateScale(1)}px;
  border-radius: ${moderateScale(12)}px;
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

export const TopRow = styled.View`
  flex-direction: column;
  width: 100%;
  height: ${moderateScale(45)}px;
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
  color: ${colors.primaryBlue};
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

export const LabelsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: ${moderateScale(8)}px;
  margin-top: ${moderateScale(20)}px;
  width: 100%;
`;

export const TagWrapper = styled.View`
  background-color: ${colors.lightGrey};
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Medium};
  border-radius: ${moderateScale(7)}px;
  justify-content: center;
  align-items: center;
  padding-vertical: ${moderateScale(7)}px;
  padding-horizontal: ${moderateScale(10)}px;
`;

export const TagText = styled.Text`
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Medium};
  text-align: center;
  color: ${colors.primaryBlue};
`;

export const StyledButton = styled(Button)`
  width: 100%;
`;