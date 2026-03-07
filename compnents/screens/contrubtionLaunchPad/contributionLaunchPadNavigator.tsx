import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NavigationButton } from "../../navigationHeader/NavigationButton";
import { NavigationHeader } from "../../navigationHeader/NavigationHeader";

import ContributionLaunchPad from ".";

export type ContributionLaunchPadRoutes = {
  ContributionLaunchPad: undefined;
  SiteSubmitter: undefined;
  SyncScreen: undefined;
  GoogleMap: undefined;
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

    </Stack.Navigator>
  );
}