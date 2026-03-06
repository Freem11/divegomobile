import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// import GoogleMap from "../../../googleMap";
import SiteSubmitterScreen from "../formScreens/siteSubmitter/SiteSubmitterScreen";
import { NavigationButton } from "../../navigationHeader/NavigationButton";
import { NavigationHeader } from "../../navigationHeader/NavigationHeader";
import UniversalSync from "../QRscreen";

import ContributionLaunchPad from ".";

export type ContributionLaunchPadRoutes = {
  ContributionLaunchPad: undefined;
  SiteSubmitter: undefined;
  SyncScreen: undefined
};

const Stack = createNativeStackNavigator<ContributionLaunchPadRoutes>();

export default function ContributionLaunchPadNavigator() {

  return (
    <Stack.Navigator
      initialRouteName="ContributionLaunchPad"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
        detachPreviousScreen: false
      })}
    >

      <Stack.Screen
        name={"ContributionLaunchPad"}
        component={ContributionLaunchPad}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={"Contribute"}
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

      <Stack.Screen
        name={"SyncScreen"}
        component={UniversalSync}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={"Device Sync"}
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

      {/* <Stack.Screen name="GoogleMap" component={GoogleMap} /> */}

    </Stack.Navigator>
  );
}