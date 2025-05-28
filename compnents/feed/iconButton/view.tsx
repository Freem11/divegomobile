import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TouchableWithoutFeedback } from "react-native";
import Animated from "react-native-reanimated";
import { moderateScale } from "react-native-size-matters";
import * as S from "./styles";
import { useTranslation } from "react-i18next";

type Props = {
    feedbackReveal: any;
    onClick: () => void;
    startFeedbackAnimations: () => void;
};

export const FeedsView = ({
    onClick,
    feedbackReveal,
    startFeedbackAnimations,
}: Props) => {

    const { t } = useTranslation();

    return (
        <S.FMenuAnimate pointerEvents={"box-none"}>
            <Animated.View style={[S.inline.feedback, feedbackReveal]}>
                <S.FeedRequest onPress={() => onClick()}>
                    {t("Feed.openNotifications")}
                </S.FeedRequest>
                <TouchableWithoutFeedback
                    style={S.inline.touchable}
                    onPress={startFeedbackAnimations}
                >
                    <MaterialCommunityIcons
                        name="message-alert-outline"
                        size={24}
                        color="white"
                        style={{ marginTop: moderateScale(3), marginRight: moderateScale(2) }}
                    />
                </TouchableWithoutFeedback>
            </Animated.View>
        </S.FMenuAnimate>
    );
};

