import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../../googleMap";
import { MapConfigurations } from "../../googleMap/types";

import PartnerRequestParallax from "./partnerRequestParallax";

export type PartnerRequestRoutes = {
  PartnerRequest: undefined;
  GoogleMap: { initConfig: MapConfigurations };
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
      <Stack.Screen name="PartnerRequest" component={PartnerRequestParallax} />

      <Stack.Screen name="GoogleMap">
        {({ route }) => (
          <GoogleMap
            initConfig={MapConfigurations.PinDrop}
          />
        )}
      </Stack.Screen>
      {/* Map Navigator - view trip & limited dive site*/}

    </Stack.Navigator>
  );
}
