import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Platform, View, ActivityIndicator } from "react-native";

import UserProfileParallax from "../screens/userProfile/userProfileParallax";
import ShopListParallax from "../screens/shopList/shopListParallax";
import Icon from "../../icons/Icon";
import { colors } from "../styles";
import { useUserProfile } from "../../store/user/useUserProfile";
import SiteSubmitterRouter from "../screens/formScreens/siteSubmitter/siteSubmitterRouter";

import { useAppNavigation } from "./types";
import HomeScreen from "./HomeScreen";

export type BottomTabRoutes = {
    Home: undefined;
    Profile: { id: number };
    Notifications: undefined;
    AddSite: undefined;
    Guides: undefined;
    Itinerary: undefined;
};

const Tab = createBottomTabNavigator<BottomTabRoutes>();

export default function BottomTabNavigator({ route, showOnboarding }: any) {
    const { userProfile } = useUserProfile();
    const { t } = useTranslation();
    const navigation = useAppNavigation();
    const insets = useSafeAreaInsets();

    const [activeProfileId, setActiveProfileId] = useState<number | null>(null);

    // Sync the ID from route params
    useEffect(() => {
        const nestedId = route.params?.params?.id;
        if (nestedId) {
            setActiveProfileId(nestedId);
        } else if (userProfile?.id) {
            setActiveProfileId(userProfile.id);
        }
    }, [route.params?.params?.id, userProfile?.id]);

    const bottomInset: number | null = (insets.bottom > 0) ? insets.bottom : null;

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => {
                const { icon, label } = getTabProps(route.name);
                return {
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.primaryBlue,
                        height: moderateScale(50) + (bottomInset ?? 0),
                    },
                    tabBarActiveTintColor: colors.themeWhite,
                    tabBarInactiveTintColor: colors.neutralGrey,
                    tabBarIcon: ({ color, size }) => (
                        <Icon name={icon} color={color} width={size} height={size} />
                    ),
                    tabBarLabel: label,
                    animation: Platform.OS === "android" ? "none" : "shift",

                    detachPreviousScreen: Platform.OS !== "android",
                };
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />

            <Tab.Screen
                name="Profile"
                options={{
                    unmountOnBlur: true,
                }}
                listeners={{
                    tabPress: () => {
                        setActiveProfileId(userProfile?.id);
                    },
                }}
            >
                {(screenProps) => (
                    activeProfileId ? (
                        <UserProfileParallax
                            {...screenProps}
                            profileID={activeProfileId}
                        />
                    ) : (
                        <View style={{ flex: 1, backgroundColor: colors.primaryBlue, justifyContent: "center" }}>
                            <ActivityIndicator color="white" />
                        </View>
                    )
                )}
            </Tab.Screen>

            <Tab.Screen
                name="AddSite"
                component={SiteSubmitterRouter}
                options={{ unmountOnBlur: true }}
            />

            {(userProfile?.partnerAccount) && (
                <Tab.Screen
                    name="Itinerary"
                    component={ShopListParallax}
                />
            )}
        </Tab.Navigator>
    );

    function getTabProps(route: string): { icon: string; label: string } {
        switch (route) {
            case "Home": return { icon: "map-outlined", label: t("BottomTabBar.home") };
            case "Profile": return { icon: "person", label: t("BottomTabBar.profile") };
            case "AddSite": return { icon: "anchor-plus", label: t("BottomTabBar.addsite") };
            case "Itinerary": return { icon: "diving-scuba-flag", label: t("BottomTabBar.itinerary") };
            default: return { icon: "question-mark", label: "Error" };
        }
    }
}