import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useStore } from "../../../store";

import { OnboardingRoutes } from "./onboardingNavigator";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";

type FinishScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Finish"
>;

export default function FinishScreen() {
  const setShowOnBoarding = useStore((state) => state.setShowOnBoarding);

  const onPress = async () => {
    setShowOnBoarding(false);
  };

  const params: OnboardingConfigParams = {
    title: "OnBoarding.doneTitle",
    content: "OnBoarding.doneContent",
    buttonOneText: "Common.finish",
    buttonOnePressCallback: onPress,
  };

  return OnboardingTemplateLayout(params);
}
