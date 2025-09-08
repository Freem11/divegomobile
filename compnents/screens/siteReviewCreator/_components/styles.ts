import styled from 'styled-components/native'
import { moderateScale } from 'react-native-size-matters'
import ToggleButton from '../../../reusables/togglebutton'

export const ButtonGroupContainer = styled.View`
  flex: 1;
  width: 100%;
`

export const ButtonRow = styled.View`
  flex-direction: row;
  width: 100%;
  gap: ${moderateScale(8)}px;
  margin-bottom: ${moderateScale(8)}px;
`

export const StyledButton = styled(ToggleButton)`
  flex: 1;
  justify-content: flex-start;
  width: auto;
`
