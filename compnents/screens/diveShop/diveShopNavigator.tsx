import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import EditScreenParallax from "../edits/editsParallax";
import GoogleMap from "../../googleMap";
import TripCreatorScreen from "../formScreens/tripCreator/TripCreatorScreen";
import { NavigationHeader } from "../../navigationHeader/NavigationHeader";
import { NavigationButton } from "../../navigationHeader/NavigationButton";
import { EditModeContext } from "../../contexts/editModeContext";
import Confirmations from "../confirmationPage/confirmations";
import { EDIT_TYPE } from "../../../entities/editTypes";

import DiveShopeParallax from "./diveShopParallax";

type DiveShopNavigatorProps = {
  id: number;
  dataType: EDIT_TYPE;
};

export type DiveShopRoutes = {
  DiveCentre: undefined;
  EditScreen: { id: number, dataType: EDIT_TYPE };
  GoogleMap: undefined;
  TripCreator: { id: number | null, subTitle: string, shopId: number };
  ConfirmationScreen: { title: string, subTitle: string, returnNav: () => void };
};

const Stack = createNativeStackNavigator<DiveShopRoutes>();

export default function DiveShopNavigator(props: DiveShopNavigatorProps) {
  const { editMode } = useContext(EditModeContext);

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

      <Stack.Screen name="EditScreen">
        {({ route }) => (
          <EditScreenParallax
            id={route.params.id}
            dataType={route.params.dataType}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ConfirmationScreen">
        {({ route }) => (
          <Confirmations
            title={route.params.title}
            subTitle={route.params.subTitle}
            returnNav={route.params.returnNav}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name={"TripCreator"}
        component={TripCreatorScreen}
        options={({ route }) => ({
          headerShown: true,
          header: ({ navigation }) => (
            <NavigationHeader
              title={"Trip Creator"}
              subtitle={editMode ? route.params.subTitle : "New Trip"}
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
      {/* Map Navigator - view trip & limited dive site*/}
    </Stack.Navigator>
  );
}
