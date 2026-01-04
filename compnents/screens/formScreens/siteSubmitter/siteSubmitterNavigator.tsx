import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import GoogleMap from "../../../googleMap";
import { NavigationButton } from "../../../navigationHeader/NavigationButton";
import { NavigationHeader } from "../../../navigationHeader/NavigationHeader";

import SiteSubmitterScreen from "./SiteSubmitterScreen";

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
        detachPreviousScreen: false
      })}
    >

      <Stack.Screen
        name={"SiteSubmitter"}
        component={SiteSubmitterScreen}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={"New Dive Site"}
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

    </Stack.Navigator>
  );
}