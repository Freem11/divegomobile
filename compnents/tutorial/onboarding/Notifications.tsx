import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { registerForPushNotificationsAsync } from "../notificationsRegistery";
import { useUserProfile } from "../../../store/user/useUserProfile";

import { OnboardingRoutes } from "./onboardingNavigator";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Notifications"
>;

export default function NotificationsScreen() {
  const navigation = useNavigation<NotificationsScreenNavigationProp>();

  const moveToNextPage = () => {
    navigation.replace("Finish");
  };

  const { userProfile } = useUserProfile();

  const onPress = async() => {
    await registerForPushNotificationsAsync(userProfile.UserID, "no");
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
