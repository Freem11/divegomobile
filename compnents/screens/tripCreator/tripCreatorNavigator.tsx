import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../../googleMap";

import TripCreatorParallax from "./tripCreatorParallax";

type TripCreatorNavigatorProps = {
  id: number | null;
};

export type TripCreatorRoutes = {
  TripCreator: undefined;
  GoogleMap: undefined;
};

const Stack = createNativeStackNavigator<TripCreatorRoutes>();

export default function TripCreatorNavigator(props: TripCreatorNavigatorProps) {

  return (
    <Stack.Navigator
      initialRouteName="TripCreator"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
      })}
    >

      <Stack.Screen name="TripCreator">
        {(screenProps) => (
          <TripCreatorParallax
            {...screenProps}
            id={props.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GoogleMap" component={GoogleMap} />
      {/* Map Navigator - view trip & limited dive site*/}

    </Stack.Navigator>
  );
}
