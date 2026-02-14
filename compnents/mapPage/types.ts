import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { CompositeNavigationProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { BottomTabRoutes } from "./bottomTabNavigator";
import { MainRoutes } from "./mainNavigator";

// Type for the main StackNavigator which also contains the BottomTabNavigator
export type MainStackNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<MainRoutes>,
  BottomTabNavigationProp<BottomTabRoutes>
>;

// A custom hook to use the typed navigation
export function useAppNavigation() {
  return useNavigation<MainStackNavigationProp>();
}