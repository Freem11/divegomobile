import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../../styles";
import emilio from "../../png/guideIcons/EmilioNew.png";

import WelcomeScreen from "./Welcome"
import DiverNameScreen from "./DiverName";
import { NavigationContainer } from "@react-navigation/native";
import LocationScreen from "./Location";
import GalleryScreen from "./Gallery";
import NotificationsScreen from "./Notifications";
import FinishScreen from "./Finish";
import * as S from "./styles";

// All Onboarding flow related routes for type safety.
export type OnboardingRoutes = {
    Welcome: undefined,
    DiverName: undefined,
    Location: undefined,
    Gallery: undefined,
    Notifications: undefined,
    Finish: undefined
}

export default function OnboardingNavigator() {
    const Stack = createNativeStackNavigator<OnboardingRoutes>();

    return (
        <S.Container>
            <S.FloatingImage
                source={emilio}
                resizeMode="contain"
                style={{ transform: [{ rotate: "3deg" }] }}
            />
            <S.ScreenContainer>
                <NavigationContainer>
                    <Stack.Navigator
                        initialRouteName="Welcome"
                        screenOptions={{
                            headerShown: false,
                            animation: "slide_from_right",
                        }}
                    >
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen name="DiverName" component={DiverNameScreen} />
                        <Stack.Screen name="Location" component={LocationScreen} />
                        <Stack.Screen name="Gallery" component={GalleryScreen} />
                        <Stack.Screen name="Notifications" component={NotificationsScreen} />
                        <Stack.Screen name="Finish" component={FinishScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </S.ScreenContainer>
        </S.Container>
    );
}