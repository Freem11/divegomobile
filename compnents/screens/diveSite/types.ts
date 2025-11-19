import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DiveSiteRoutes } from "./diveSiteNavigator";

export function useDiveSiteNavigation() {
    return useNavigation<NativeStackNavigationProp<DiveSiteRoutes>>();
}