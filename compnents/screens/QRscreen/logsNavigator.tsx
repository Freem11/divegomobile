import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NavigationButton } from "../../navigationHeader/NavigationButton";
import { NavigationHeader } from "../../navigationHeader/NavigationHeader";

import { PhotoUploader } from "./components/photoUploader";

import UniversalSync from ".";

export type LogsRoutes = {
  QRSync: undefined;
  PhotoUploader: undefined;
};

const Stack = createNativeStackNavigator<LogsRoutes>();

export default function LogsNavigator() {

  return (
    <Stack.Navigator
      initialRouteName="QRSync"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
        detachPreviousScreen: false
      })}
    >

      <Stack.Screen
        name={"QRSync"}
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
              right={(
                <NavigationButton
                  onPress={() => navigation.navigate("PhotoUploader")}
                  iconName="close"
                />
              )}
            />
          )
        })}
      />

      <Stack.Screen
        name={"PhotoUploader"}
        component={PhotoUploader}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={"Photo Test"}
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