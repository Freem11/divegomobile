import React, { } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditScreenParallax from "../edits/editsParallax";
import PicUploaderParallax from "../picUploader/picUploaderParallax";
import { DiveSiteWithUserName } from "../../../entities/diveSite";
import GoogleMap from "../../googleMap";

import DiveSiteParallax from "./diveSiteParallax";

type DiveSiteNavigatorProps = {
  id: number;
};

export type DiveSiteRoutes = {
  DiveSite: undefined;
  EditScreen: undefined;
  AddSighting: { selectedDiveSite: DiveSiteWithUserName };
  GoogleMap: undefined;
};

const Stack = createNativeStackNavigator<DiveSiteRoutes>();

export default function DiveSiteNavigator(props: DiveSiteNavigatorProps) {

  return (
    <Stack.Navigator
      initialRouteName="DiveSite"
      screenOptions={() => ({
        headerShown: false,
        animation: "slide_from_bottom",
      })}
    >

      <Stack.Screen name="DiveSite">
        {(screenProps) => (
          <DiveSiteParallax
            {...screenProps}
            id={props.id}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="EditScreen" component={EditScreenParallax} />

      <Stack.Screen name="AddSighting" component={PicUploaderParallax} />

      <Stack.Screen name="GoogleMap" component={GoogleMap} />
      {/* Map Navigator - view trip & limited dive site*/}

      {/* Dive site review Navigator */}

    </Stack.Navigator>
  );
}
