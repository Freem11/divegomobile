import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../../googleMap";
import { MapConfigurations } from "../../googleMap/types";

import SiteSubmitterParallax from "./siteSubmitterParallax";

export type SiteSubmitterRoutes = {
  SiteSubmitter: undefined;
  GoogleMap: { initConfig: MapConfigurations };
};

const Stack = createNativeStackNavigator<SiteSubmitterRoutes>();

export default function SiteSubmitterNavigator() {

  return (
    <Stack.Navigator
      initialRouteName="SiteSubmitter"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
      })}
    >
      <Stack.Screen name="SiteSubmitter" component={SiteSubmitterParallax} />

      <Stack.Screen name="GoogleMap">
        {({ route }) => (
          <GoogleMap
            initConfig={MapConfigurations.TripBuild}
          />
        )}
      </Stack.Screen>
      {/* Map Navigator - view trip & limited dive site*/}

    </Stack.Navigator>
  );
}
