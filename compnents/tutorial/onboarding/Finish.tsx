import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingRoutes } from "./onboardingNavigator";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";
import { useAppNavigation } from "../../mapPage/types";

type FinishScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Finish"
>;

export default function FinishScreen() {
  const navigation = useAppNavigation();

  const onPress = async () => {
    // Simply going back from the FinishScreen (the last one) will finish the OnboardingFlow as all screens 
    // throughout the Onboarding flow were being replaced in the back stack instead of adding on top of each other.
    navigation.goBack();
  };

  const params: OnboardingConfigParams = {
    title: "OnBoarding.doneTitle",
    content: "OnBoarding.doneContent",
    buttonOneText: "Common.finish",
    buttonOnePressCallback: onPress,
  };

  return OnboardingTemplateLayout(params);
}
