import styled from 'styled-components/native';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  colors,
  fontSizes,
  activeFonts,
} from '../../styles';

const windowWidth = Dimensions.get('screen').width;

export const ContentContainer = styled.View`
    flex: 1;
    zIndex: 5;
`;

export const BackButtonWrapper = styled.View`
  position: absolute; 
  z-index: 50;
  top: 60px;
  left: 0;
  width: 100%;
  padding-horizontal: 1%;
  align-items: flex-start;
`;

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    zIndex: 50,
    width: windowWidth,
    marginTop: Platform.OS === 'ios' ? 0 : '10%',
    flexDirection: 'row',
    alignItems: 'center'
  }
});