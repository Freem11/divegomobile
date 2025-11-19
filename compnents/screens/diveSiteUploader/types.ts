import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { SiteSubmitterRoutes } from "./siteSubmitterNavigator";

export function useDiveSiteNavigation() {
    return useNavigation<NativeStackNavigationProp<SiteSubmitterRoutes>>();
}