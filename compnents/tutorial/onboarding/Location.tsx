import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { registerForForegroundLocationTrackingsAsync } from "../locationTrackingRegistry";

import { OnboardingRoutes } from "./onboardingNavigator";
import { OnboardingConfigParams, OnboardingTemplateLayout } from "./OnboardingTemplateLayout";

type LocationScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Location"
>;

export default function LocationScreen() {
  const navigation = useNavigation<LocationScreenNavigationProp>();

  const moveToNextPage = () => {
    navigation.replace("Gallery");
  };

  const onPress = async() => {
    await registerForForegroundLocationTrackingsAsync();
    moveToNextPage();
  };

  const params: OnboardingConfigParams = {
    title: "OnBoarding.locationTitle",
    content: "OnBoarding.locationContent",
    buttonOneText: "Common.accept",
    buttonOnePressCallback: onPress,
    buttonTwoText: "Common.optOut",
    buttonTwoPressCallback: moveToNextPage
  };

  return OnboardingTemplateLayout(params);
}
