import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Platform, View, ActivityIndicator, Dimensions } from "react-native";

import UserProfileParallax from "../screens/userProfile/userProfileParallax";
import ShopListParallax from "../screens/shopList/shopListParallax";
import Icon from "../../icons/Icon";
import { colors } from "../styles";
import { useUserProfile } from "../../store/user/useUserProfile";
import SiteSubmitterRouter from "../screens/formScreens/siteSubmitter/siteSubmitterRouter";
import LogsNavigator from "../screens/QRscreen/logsNavigator";

import HomeScreen from "./HomeScreen";

// Tablet detection
const { width, height } = Dimensions.get("window");
const isTablet = Math.min(width, height) >= 600;

export type BottomTabRoutes = {
    Home: undefined;
    Profile: { id: number };
    Notifications: undefined;
    AddSite: undefined;
    Guides: undefined;
    Itinerary: undefined;
    QR: undefined;
};

const Tab = createBottomTabNavigator<BottomTabRoutes>();

export default function BottomTabNavigator({ route, showOnboarding }: any) {
    const { userProfile } = useUserProfile();
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();

    const [activeProfileId, setActiveProfileId] = useState<number | null>(null);

    useEffect(() => {
        const nestedId = route.params?.params?.id;
        if (nestedId) {
            setActiveProfileId(nestedId);
        } else if (userProfile?.id) {
            setActiveProfileId(userProfile.id);
        }
    }, [route.params?.params?.id, userProfile?.id]);

    const bottomInset = insets.bottom > 0 ? insets.bottom : 0;

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => {
                const { icon, label } = getTabProps(route.name);

                const iconSize = moderateScale(isTablet ? 30 : 24, 0.4);
                const barHeight = moderateScale(isTablet ? 75 : 55, 0.4);
                const fontSize = moderateScale(isTablet ? 12 : 10, 0.3);
                const paddingTopValue = isTablet ? 30 : 5;

                return {
                    headerShown: false,
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

                    tabBarIconStyle: {
                        marginBottom: moderateScale(isTablet ? 4 : 2),
                    },

                    tabBarLabelStyle: {
                        fontSize: fontSize,
                        fontWeight: "500",
                    },
                    tabBarIcon: ({ color }) => (
                        <Icon
                            name={icon}
                            color={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    ),
                    tabBarLabel: label,
                    animation: Platform.OS === "android" ? "none" : "shift",
                };
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen
                name="Profile"
                options={{ unmountOnBlur: true }}
                listeners={{
                    tabPress: () => { setActiveProfileId(userProfile?.id); },
                }}
            >
                {(screenProps) => (
                    activeProfileId ? (
                        <UserProfileParallax {...screenProps} profileID={activeProfileId} />
                    ) : (
                        <View style={{ flex: 1, backgroundColor: colors.primaryBlue, justifyContent: "center" }}>
                            <ActivityIndicator color="white" />
                        </View>
                    )
                )}
            </Tab.Screen>
            <Tab.Screen name="AddSite" component={SiteSubmitterRouter} options={{ unmountOnBlur: true }} />
            {(userProfile?.partnerAccount) && (
                <Tab.Screen name="Itinerary" component={ShopListParallax} />
            )}

            <Tab.Screen name="QR" component={LogsNavigator} />
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