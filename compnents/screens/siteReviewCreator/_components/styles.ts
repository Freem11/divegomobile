import styled from 'styled-components/native'
import { moderateScale } from 'react-native-size-matters'
import ToggleButton from '../../../reusables/togglebutton'
import { colors } from "../../../styles";

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

// Photo Upload
export const Wrapper = styled.View`
  width: 100%;
  margin-top: ${moderateScale(8)}px;
`;

export const Item = styled.View`
  overflow: hidden;
`;

export const AddSightingButton = styled.TouchableOpacity`
  overflow: hidden;
  background: ${colors.lighterBlue};
  align-items: center;
  justify-content: center;
`;