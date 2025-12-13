import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { PartnerRequestRoutes } from "./partnerRequestNavigator";

export function usePartnerRequestNavigation() {
    return useNavigation<NativeStackNavigationProp<PartnerRequestRoutes>>();
}