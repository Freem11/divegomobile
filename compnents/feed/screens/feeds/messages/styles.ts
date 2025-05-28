import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";
import { activeFonts, colors } from "../../../../styles";

export const Card = styled.View<{ bg?: string }>`
  width: 100%;
  background-color: ${(props) => props.bg || "#f2f2f2"};
  border-radius: 10px;
  padding: ${moderateScale(15)}px;
`;

export const Message = styled.Text`
  font-size: ${moderateScale(14)}px;
  color: ${colors.themeBlack};
  font-family: ${activeFonts.Regular};
  margin-bottom: ${moderateScale(4)}px;
`;

export const Timestamp = styled.Text`
  font-size: ${moderateScale(12)}px;
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
  color: #2196f3;
  font-size: ${moderateScale(14)}px;
  font-family: ${activeFonts.Bold};
`;

export const RemoveText = styled(ActionText)`
  color: red;
  margin-left: ${moderateScale(20)}px;
`;

export const PrimaryText = styled(ActionText)`
  color: #4caf50;
`;

export const IconWrapper = styled.TouchableOpacity`
  margin-left: ${moderateScale(12)}px;
  justify-content: center;
  align-items: center;
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
  color: #555;
  font-family: ${activeFonts.Italic};
  font-size: ${moderateScale(12)}px;
`;
