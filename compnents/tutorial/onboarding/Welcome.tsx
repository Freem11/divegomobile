import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingRoutes } from "./onboardingNavigator";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Welcome"
>;

export default function WelcomeScreen() {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  const onPress = async () => {
    navigation.replace("DiverName");
  };

  const params: OnboardingConfigParams = {
    title: "OnBoarding.welcomeTitle",
    content: "OnBoarding.welcomeContent",
    buttonOneText: "Common.next",
    buttonOnePressCallback: onPress
  };

  return OnboardingTemplateLayout(params);
}
