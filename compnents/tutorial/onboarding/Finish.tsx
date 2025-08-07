import { useContext } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingRoutes } from "./onboardingNavigator";
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";

type FinishScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Finish"
>;

export default function FinishScreen() {
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  const onPress = async () => {
    setFullScreenModal(false);
  };

  const params: OnboardingConfigParams = {
    title: "OnBoarding.doneTitle",
    content: "OnBoarding.doneContent",
    buttonOneText: "Common.finish",
    buttonOnePressCallback: onPress,
  };

  return OnboardingTemplateLayout(params);
}
