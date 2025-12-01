import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../../googleMap";

import SiteSubmitterParallax from "./siteSubmitterParallax";

export type SiteSubmitterRoutes = {
  SiteSubmitter: undefined;
  GoogleMap: undefined;
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

      <Stack.Screen name="GoogleMap" component={GoogleMap} />
      {/* Map Navigator - view trip & limited dive site*/}

    </Stack.Navigator>
  );
}
