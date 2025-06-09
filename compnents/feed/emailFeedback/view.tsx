import { Octicons } from "@expo/vector-icons";
import { TouchableWithoutFeedback } from "react-native";
import Animated from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";
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
                    <Octicons
                        name="paper-airplane"
                        size={moderateScale(24)}
                        color="white"
                        style={{ marginTop: moderateScale(3) }}
                    />
                </TouchableWithoutFeedback>
            </Animated.View>
        </S.FMenuAnimate>
    );
};

