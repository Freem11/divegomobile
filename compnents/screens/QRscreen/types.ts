import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { LogsRoutes } from "./logsNavigator";

export function useLogsNavigation() {
    return useNavigation<NativeStackNavigationProp<LogsRoutes>>();
}