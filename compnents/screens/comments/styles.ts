import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors, activeFonts, fontSizes } from "../../styles";
import ButtonIcon from "../../reusables/buttonIcon-new";

export const MainContainer = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${colors.themeWhite};
`;

export const CommentEntryContainer = styled.View`
  width: 100%;
  background-color: ${colors.themeWhite};
  padding-horizontal: ${moderateScale(12)}px;
  padding-top: ${moderateScale(10)}px;
  border-top-width: ${moderateScale(1)}px;
  border-top-color: ${colors.lightGrey};
  elevation: 10;
  shadow-color: #000;
  shadow-offset: 0px -2px;
  shadow-opacity: 0.1;
  shadow-radius: 3px;
`;

export const ParallaxWrapper = styled.View`
  flex: 1;
  background-color: ${colors.themeWhite};
`;

export const ReplyLine = styled.View`
  background-color: ${colors.lighterBlue};
  flex-direction: row;
  align-items: center;
  align-self: flex-start;
  padding-horizontal: ${moderateScale(10)}px;
  padding-vertical: ${moderateScale(2)}px;
  border-radius: ${moderateScale(5)}px;
  margin-bottom: ${moderateScale(8)}px;
`;

export const ReplyText = styled.Text`
  font-size: ${moderateScale(fontSizes.Micro)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.themeBlack};
`;

export const ReplyBox = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const StyledButtonIcon = styled(ButtonIcon)`
  width: ${moderateScale(25)}px;
  height: ${moderateScale(25)}px;
  margin-left: ${moderateScale(5)}px;
  margin-right: 0px;
  background-color: transparent;
`;

export const MainScreen = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${colors.themeWhite};
  padding-top: ${moderateScale(8)}px;
`;

export const HeaderText = styled.Text`
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
  margin-bottom: ${moderateScale(8)}px;
  text-align: center;
`;

export const CommentsContainer = styled.View`
  flex: 1;
  padding-bottom: ${moderateScale(130)}px;
`;

export const EmptyState = styled.View`
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${moderateScale(20)}px;
`;

export const EmptyText = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Light};
  color: ${colors.themeBlack};
`;

export const EmptySubText = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Thin};
  color: ${colors.darkGrey};
  margin-top: ${moderateScale(6)}px;
`;

export const EmptySpacer = styled.View`
    height: ${moderateScale(120)}px;
`;