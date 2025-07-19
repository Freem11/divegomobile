import styled from 'styled-components/native'
import { moderateScale } from 'react-native-size-matters'

import { colors, fontSizes, activeFonts } from '../../styles'

export const GhostButtonText = styled.Text`
  color: ${colors.primaryBlue};
  font-family: ${activeFonts.Medium};
  font-size: ${fontSizes.StandardText}px;
  padding-left: ${moderateScale(12)}px;
`

export const GhostButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`