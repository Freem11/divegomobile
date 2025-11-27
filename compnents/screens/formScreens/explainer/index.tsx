import { moderateScale } from "react-native-size-matters";
import React, { FC, useRef, useState, forwardRef } from "react"; // 👈 1. Import forwardRef
import Popover from "react-native-popover-view";
import { View } from "react-native";
import { Placement } from "react-native-popover-view/dist/Types";

import { colors } from "../../../styles";
import Icon from "../../../../icons/Icon";

import * as S from "./styles";

interface ExplainerProps {
  popoverContent?: () => React.JSX.Element,
}

export const Explainer = forwardRef<View, ExplainerProps>(({ popoverContent }, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  const internalRef = useRef<View>(null);

  const setRefs = (element: View | null) => {
    internalRef.current = element;
    if (typeof ref === "function") {
      ref(element);
    } else if (ref) {
      (ref as React.MutableRefObject<View | null>).current = element;
    }
  };

  return (
    <S.Explainer
      ref={setRefs}
      onPress={() => setIsVisible(true)}
    >
      <Icon
        name={"question-mark"}
        color={colors.borderActive}
        width={moderateScale(15)}
        height={moderateScale(15)}
      />

      <Popover
        from={internalRef}
        isVisible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        placement={Placement.AUTO}
        popoverStyle={{ borderRadius: moderateScale(10) }}
      >
        {popoverContent()}
      </Popover>

    </S.Explainer >
  );
});

Explainer.displayName = "Explainer";