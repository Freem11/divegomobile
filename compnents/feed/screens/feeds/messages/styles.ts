import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { activeFonts, colors, fontSizes } from "../../../../styles";

export const Card = styled.View<{ bg?: string }>`
  width: 100%;
  background-color: ${(props) => props.bg || "#f2f2f2"};
  border-radius: 10px;
  padding: ${moderateScale(15)}px;
`;

export const Message = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  color: ${colors.themeBlack};
  font-family: ${activeFonts.Regular};
  margin-bottom: ${moderateScale(4)}px;
`;

export const Timestamp = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  color: gray;
  font-family: ${activeFonts.ThinItalic};
`;

export const ImagePreview = styled.Image`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  margin-vertical: ${moderateScale(8)}px;
`;

export const ActionsRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${moderateScale(8)}px;
`;

export const ActionText = styled.Text`
  color: ${colors.primaryBlue};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Bold};
`;

export const RemoveText = styled(ActionText)`
  color: red;
  margin-left: ${moderateScale(20)}px;
`;

export const PrimaryText = styled(ActionText)`
  color: ${colors.themeGreen};
`;

export const ImageFallback = styled.View`
  width: 100%;
  height: 150px;
  border-radius: 8px;
  margin-vertical: ${moderateScale(8)}px;
  background-color: #ccc;
  justify-content: center;
  align-items: center;
`;

export const FallbackText = styled.Text`
  color: ${colors.neutralGrey};
  font-family: ${activeFonts.Italic};
  font-size: ${moderateScale(fontSizes.SmallText)}px;
`;

export const CommentBlock = styled.View`
  margin-top: 8px;
`;

export const CommentText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  color: ${colors.themeBlack};
  font-family: ${activeFonts.Regular};
  line-height: ${moderateScale(fontSizes.SmallText) * 1.4}px;
`;
