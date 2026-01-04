import styled from "styled-components/native";
import { moderateScale } from "react-native-size-matters";

import { colors } from "../../../styles";

/**
 * Main container for the photo upload section
 */
export const Wrapper = styled.View`
  width: 100%;
  margin-top: ${moderateScale(4)}px;
`;

/**
 * Individual photo container.
 * We use overflow: hidden to ensure the image stays within rounded corners.
 */
export const Item = styled.View`
  overflow: hidden;
  border-radius: ${moderateScale(8)}px;
  background-color: ${colors.lightGrey};
`;

export const AddSightingButton = styled.View`
  background-color: ${colors.lighterBlue};
  align-items: center;
  justify-content: center;
  border-radius: ${moderateScale(8)}px;
`;

export const RemoveButton = styled.View`
  width: ${moderateScale(28)}px;
  height: ${moderateScale(28)}px;
  border-radius: ${moderateScale(14)}px;
  background-color: rgba(0, 0, 0, 0.6);
  align-items: center;
  justify-content: center;
  
  /* Android Specific: Ensures the button is high enough in 
     the view stack to receive touch events */
  elevation: 15;
`;