import styled from 'styled-components/native';
import { Dimensions, Platform, SafeAreaView } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';

const windowHeight = Dimensions.get('screen').height;

export const ContentContainer = styled.View`
  flex: 1;
  background-color: ${colors.themeWhite};
  align-items: left;
  height: ${windowHeight};
`;

export const SafeArea = styled(SafeAreaView)`
  z-index: 20;
  margin-top: ${Platform.OS === 'ios' ? 0 : '10%'};
  background-color: ${colors.themeWhite};
`;

export const BackButtonWrapper = styled.View`
  width: 50%;
  align-items: flex-start;
`;

export const InputGroupContainer = styled.View`
  width: 90%;
  margin-left: 5%;
`;

export const Header = styled.Text`
  margin-bottom: 5%;
  marginTop: 10%;
  font-size: ${moderateScale(fontSizes.Header)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.neutralGrey};
`;

export const SubHeader = styled.Text`
  margin-top: 10%;
  margin-left: 5%;
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Medium};
  color: ${colors.headersBlue};
`;

export const DataHousing = styled.View`
  width: 100%;
  margin-top: 5%;
  borderTopWidth: ${moderateScale(1)};
  borderBottomWidth: ${moderateScale(1)};
  borderTopColor: ${colors.neutralGrey};
  borderBottomColor: ${colors.neutralGrey};
`;

export const DataLabels = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.themeBlack};
  margin-top: 3%;
  margin-left: 5%;
`;

export const DataLabelsAlt = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.themeBlack};
  margin-vertical: 5%;
  margin-left: 5%;
`;

export const PromptLinkText = styled.Text`
  font-size: ${moderateScale(fontSizes.SmallText)}px;
  font-family: ${activeFonts.Bold};
  color: ${colors.primaryBlue};
  margin-top: 2%;
  margin-bottom: 3%;
  margin-left: 15%;
`;

export const ButtonBox = styled.View`
  width: 100%;
  align-items: flex-end;
  margin-top: 10%;
`;

export const InputGroupContainerDanger = styled.View`
  position: absolute;
  bottom: ${moderateScale(40)};
  width: 90%;
  margin-left: 5%;
`;

export const SubHeaderDanger = styled.Text`
  font-size: ${moderateScale(fontSizes.SubHeading)}px;
  font-family: ${activeFonts.Medium};
  color: maroon;
  margin-left: 5%;
`;

export const DataHousingDanger = styled.View`
  background-color: #FCE4EC;
  width: 100%;
  margin-top: 5%;
  borderTopWidth: ${moderateScale(1)};
  borderBottomWidth: ${moderateScale(1)};
  borderTopColor: maroon;
  borderBottomColor: maroon;
`;

export const DataLabelsDanger = styled.Text`
  font-size: ${moderateScale(fontSizes.StandardText)}px;
  font-family: ${activeFonts.Bold};
  color: maroon;
  margin-vertical: 5%;
  text-align: center;
`;
