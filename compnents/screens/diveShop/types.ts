import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DiveShopRoutes } from "./diveShopNavigator";

export function useDiveShopNavigation() {
    return useNavigation<NativeStackNavigationProp<DiveShopRoutes>>();
}