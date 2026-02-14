import React, { useRef, useState } from "react";
import { View, Text } from "react-native";
import Popover from "react-native-popover-view";
import { moderateScale } from "react-native-size-matters";

import Chip from "./components/Chip";

interface ConditionChipProps {
  value: string;
  explanation: string;
  bgColor: string;
  textColor: string;
}

export const ConditionChip: React.FC<ConditionChipProps> = ({ value, explanation, bgColor, textColor }) => {
  const [showPopover, setShowPopover] = useState(false);
  const touchableRef = useRef<View>(null);

  if (!value) return null;

  return (
    <>
      <View ref={touchableRef} collapsable={false}>
        <Chip
          value={value}
          bgColor={bgColor}
          textColor={textColor}
          onPress={() => setShowPopover(true)}
        />
      </View>

      <Popover
        from={touchableRef}
        isVisible={showPopover}
        onRequestClose={() => setShowPopover(false)}
        popoverStyle={{
          borderRadius: moderateScale(10),
          padding: moderateScale(12),
          maxWidth: moderateScale(250),
        }}
      >
        <Text style={{ fontSize: moderateScale(14), color: "#333", textAlign: "center" }}>
          {explanation}
        </Text>
      </Popover>
    </>
  );
};