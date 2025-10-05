import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import Animated from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";

import ButtonIcon from "../../reusables/buttonIcon";
import { colors } from "../../styles";

import * as S from "./styles";

type Props = {
  feedbackReveal: any;
  handleEmail: () => void;
  startFeedbackAnimations: () => void;
};

export const EmailView = ({
  handleEmail,
  feedbackReveal,
  startFeedbackAnimations,
}: Props) => {
  return (
    <S.FMenuAnimate pointerEvents={"box-none"}>
      <Animated.View style={[S.inline.feedback, feedbackReveal]}>
        <S.FeedRequest onPress={() => handleEmail()}>
          Send Scuba SEAsons feedback
        </S.FeedRequest>
        <TouchableWithoutFeedback
          style={S.inline.touchable}
          onPress={startFeedbackAnimations}
        >
          <ButtonIcon
            icon="send-circle-outline"
            onPress={() => null}
            size="icon"
            fillColor={colors.themeWhite}
            style={{ marginTop: moderateScale(3) }}
          />
        </TouchableWithoutFeedback>
      </Animated.View>
    </S.FMenuAnimate>
  );
};

