import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../../../googleMap";
import { NavigationHeader } from "../../../navigationHeader/NavigationHeader";
import { NavigationButton } from "../../../navigationHeader/NavigationButton";

import PartnerRequestScreen from "./PartnerRequestsScreen";

export type PartnerRequestRoutes = {
  PartnerRequest: undefined;
  GoogleMap: undefined;
};

const Stack = createNativeStackNavigator<PartnerRequestRoutes>();

export default function PartnerRequestNavigator() {

  return (
    <Stack.Navigator
      initialRouteName="PartnerRequest"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
      })}
    >

      <Stack.Screen
        name={"PartnerRequest"}
        component={PartnerRequestScreen}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={"Partner Account"}
              subtitle={"Request Form"}
              left={(
                <NavigationButton
                  onPress={() => navigation.goBack()}
                  iconName="close"
                />
              )}
            />
          )
        })}
      />

      <Stack.Screen name="GoogleMap" component={GoogleMap} />
      {/* Map Navigator - view trip & limited dive site*/}

    </Stack.Navigator>
  );
}
