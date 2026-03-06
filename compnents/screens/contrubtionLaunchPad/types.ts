import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { ContributionLaunchPadRoutes } from "./contributionLaunchPadNavigator";

export function useContributionLaunchPadNavigation() {
    return useNavigation<NativeStackNavigationProp<ContributionLaunchPadRoutes>>();
}