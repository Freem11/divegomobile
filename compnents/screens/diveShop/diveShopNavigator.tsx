import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditScreenParallax from "../edits/editsParallax";
import GoogleMap from "../../googleMap";
import TripCreatorRouter from "../formScreens/tripCreator/tripCreatorRouter";
import TripCreatorScreen from "../formScreens/tripCreator/TripCreatorScreen";
import { NavigationHeader } from "../../navigationHeader/NavigationHeader";
import { NavigationButton } from "../../navigationHeader/NavigationButton";

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

      <Stack.Screen
        name={"TripCreator"}
        component={TripCreatorScreen}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={"Trip Creator"}
              subtitle={"New Trip"}
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
      {/* <Stack.Screen name="TripCreator">
        {({ route }) => (
          <TripCreatorScreen
            id={route.params.id}
          />
        )}
      </Stack.Screen> */}

      <Stack.Screen name="GoogleMap" component={GoogleMap} />
      {/* Map Navigator - view trip & limited dive site*/}
    </Stack.Navigator>
  );
}
