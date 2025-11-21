import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { TripCreatorRoutes } from "./tripCreatorNavigator";

export function useTripCreatorNavigation() {
    return useNavigation<NativeStackNavigationProp<TripCreatorRoutes>>();
}