import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Platform, Dimensions } from "react-native";

import UserProfileParallax from "../screens/userProfile/userProfileParallax";
import ShopListParallax from "../screens/shopList/shopListParallax";
import Icon from "../../icons/Icon";
import { colors } from "../styles";
import { useUserProfile } from "../../store/user/useUserProfile";
import SiteSubmitterRouter from "../screens/formScreens/siteSubmitter/siteSubmitterRouter";
import HomeScreen from "./HomeScreen";
import { useNotificationsStore } from "../feed/store/useNotificationsStore";

const { width, height } = Dimensions.get("window");
const isTablet = Math.min(width, height) >= 600;

export type BottomTabRoutes = {
    Home: undefined;
    Profile: { id: number };
    AddSite: undefined;
    Itinerary: undefined;
};

const Tab = createBottomTabNavigator<BottomTabRoutes>();

export default function BottomTabNavigator() {
    const { userProfile } = useUserProfile();

    const notificationsCount = useNotificationsStore((s) => s.count);

    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const bottomInset = insets.bottom > 0 ? insets.bottom : 0;

    return (
        <Tab.Navigator
            initialRouteName="Home"
            sceneContainerStyle={{ backgroundColor: colors.primaryBlue }}
            screenOptions={({ route }) => {
                const { icon, label } = getTabProps(route.name);
                const iconSize = moderateScale(isTablet ? 30 : 24, 0.4);
                const barHeight = moderateScale(isTablet ? 75 : 55, 0.4);
                const fontSize = moderateScale(isTablet ? 12 : 10, 0.3);
                const paddingTopValue = isTablet ? 30 : 5;

                return {
                    headerShown: false,
                    tabBarBadge: isNotificationsRoute ? badge : undefined,
                    tabBarBadgeStyle: {
                        backgroundColor: "red",
                        color: "white",
                        fontSize: moderateScale(10),
                        fontWeight: "600",
                    },
                    tabBarLabelPosition: "below-icon",
                    tabBarStyle: {
                        backgroundColor: colors.primaryBlue,
                        height: barHeight + bottomInset,
                        marginTop: -1,
                        borderTopWidth: 0,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    tabBarItemStyle: {
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        paddingTop: paddingTopValue,
                    },
                    tabBarActiveTintColor: colors.themeWhite,
                    tabBarInactiveTintColor: colors.neutralGrey,
                    tabBarIcon: ({ color }) => (
                        <Icon name={icon} color={color} width={iconSize} height={iconSize} />
                    ),
                    tabBarLabel: label,
                    animation: Platform.OS === "android" ? "none" : "shift",
                    lazy: true,
                };
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />

            <Tab.Screen
                name="Profile"
                component={UserProfileParallax}
                initialParams={{ id: userProfile?.id }}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        // Force navigation to the tab with the logged-in user's ID
                        navigation.navigate("Profile", { id: userProfile?.id });
                    },
                })}
            />

            <Tab.Screen
                name="AddSite"
                component={SiteSubmitterRouter}
                options={{ unmountOnBlur: true }}
            />

            {userProfile?.partnerAccount && (
                <Tab.Screen name="Itinerary" component={ShopListParallax} />
            )}
        </Tab.Navigator>
    );

    function getTabProps(route: string): { icon: string; label: string } {
        switch (route) {
            case "Home": return { icon: "map-outlined", label: t("BottomTabBar.home") };
            case "Profile": return { icon: "person", label: t("BottomTabBar.profile") };
            case "Notifications": return { icon: "bell-ring-outline", label: t("BottomTabBar.notifications") };
            case "AddSite": return { icon: "anchor-plus", label: t("BottomTabBar.addsite") };
            case "Itinerary": return { icon: "diving-scuba-flag", label: t("BottomTabBar.itinerary") };
            default: return { icon: "question-mark", label: "Error" };
        }
    }
}