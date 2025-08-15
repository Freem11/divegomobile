import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingRoutes } from "./onboardingNavigator";
import { registerForPushNotificationsAsync } from "../notificationsRegistery";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
    OnboardingRoutes,
    "Notifications"
>;

export default function NotificationsScreen() {
    const navigation = useNavigation<NotificationsScreenNavigationProp>();

    const moveToNextPage = () => {
        navigation.replace("Finish");
    }

    const onPress = async () => {
        await registerForPushNotificationsAsync();
        moveToNextPage();
    };

    const params: OnboardingConfigParams = {
        title: "OnBoarding.notificationsTitle",
        content: "OnBoarding.notificationsContent",
        buttonOneText: "Common.accept",
        buttonOnePressCallback: onPress,
        buttonTwoText: "Common.optOut",
        buttonTwoPressCallback: moveToNextPage
    };

    return OnboardingTemplateLayout(params);
}
