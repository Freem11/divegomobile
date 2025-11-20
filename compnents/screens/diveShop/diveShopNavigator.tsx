import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditScreenParallax from "../edits/editsParallax";
import GoogleMap from "../../googleMap";
import TripCreatorRouter from "../tripCreator/tripCreatorRouter";

import DiveShopeParallax from "./diveShopParallax";

type DiveShopNavigatorProps = {
  id: number;
};

export type DiveShopRoutes = {
  DiveCentre: undefined;
  EditScreen: undefined;
  GoogleMap: undefined;
  TripCreator: { id: number | null };
};

const Stack = createNativeStackNavigator<DiveShopRoutes>();

export default function DiveShopNavigator(props: DiveShopNavigatorProps) {

  return (
    <Stack.Navigator
      initialRouteName="DiveCentre"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
      })}
    >

      <Stack.Screen name="DiveCentre">
        {(screenProps) => (
          <DiveShopeParallax
            {...screenProps}
            id={props.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="EditScreen" component={EditScreenParallax} />

      <Stack.Screen name="TripCreator">
        {({ route }) => (
          <TripCreatorRouter
            id={route.params.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="GoogleMap" component={GoogleMap} />
      {/* Map Navigator - view trip & limited dive site*/}
    </Stack.Navigator>
  );
}
