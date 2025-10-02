
// navigation/types.ts
import { useNavigation, NavigationProp } from "@react-navigation/native";

import { MainRoutes } from "../../../mapPage/mainNavigator";

// Define a type for your main navigation stack
export type MainStackNavigationProp = NavigationProp<MainRoutes>;

// A custom hook to use the typed navigation
export function useAppNavigation() {
    return useNavigation<MainStackNavigationProp>();
}