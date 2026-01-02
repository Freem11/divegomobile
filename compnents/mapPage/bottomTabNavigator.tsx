import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";

import UserProfileParallax from "../screens/userProfile/userProfileParallax";
import ShopListParallax from "../screens/shopList/shopListParallax";
import FeedList from "../feed/screens/feeds";
import Icon from "../../icons/Icon";
import { colors } from "../styles";
import { useUserProfile } from "../../store/user/useUserProfile";
import SiteSubmitterRouter from "../screens/formScreens/siteSubmitter/siteSubmitterRouter";

import { useAppNavigation } from "./types";
import HomeScreen from "./HomeScreen";

export type BottomTabRoutes = {
    Home: undefined;
    Profile: undefined;
    Notifications: undefined;
    AddSite: undefined;
    Guides: undefined;
    Itinerary: undefined;
};

type BottomTabNavigatorProps = {
    showOnboarding: boolean
};

const Tab = createBottomTabNavigator<BottomTabRoutes>();

export default function BottomTabNavigator(props: BottomTabNavigatorProps) {
    const { userProfile } = useUserProfile();
    const PARTNER_ACCOUNT_STATUS = (userProfile?.partnerAccount) || false;

    const { t } = useTranslation();
    const navigation = useAppNavigation();

    /**
                                                                 * For Android only.
                                                                 * If Android users have the 3 button Bottom system bar navigation enabled instead of gesture navigation,
                                                                 * then we need to add additional space underneath the button(s) so that the button(s) do not overlap the Bottom system bar.
                                                                 */
    const insets = useSafeAreaInsets();
    const bottomInset: number | null = (insets.bottom > 0) ? insets.bottom : null;

    useEffect(() => {
        if (props.showOnboarding) {
            navigation.navigate("Onboarding");
        }
    }, [props.showOnboarding, navigation]);

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => {
                const { icon, label } = getTabProps(route.name);

                const isTablet = (Platform.OS === "ios" && (Platform as any).isPad) || (Platform.OS === "android" && (Platform as any).isTablet);
                const tabBarIconHeightSurplus = isTablet
                    ? moderateScale(5)
                    : moderateScale(0);

                const tabBarIconMargin = isTablet
                    ? moderateScale(4)
                    : moderateScale(0);

                return {
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: colors.primaryBlue,
                        height: moderateScale(50) + (bottomInset ?? 0),
                    },
                    tabBarLabelStyle: {
                        fontSize: moderateScale(11),
                    },
                    tabBarActiveTintColor: colors.themeWhite,
                    tabBarInactiveTintColor: colors.neutralGrey,
                    tabBarIcon: ({ color, size }) => {
                        return <Icon name={icon} color={color} width={size + tabBarIconHeightSurplus} height={size + tabBarIconHeightSurplus} />;
                    },
                    tabBarIconStyle: {
                        marginTop: tabBarIconMargin,
                        marginBottom: tabBarIconMargin,
                    },
                    tabBarLabel: label,
                    animation: "shift",
                    tabBarLabelPosition: "below-icon",
                };
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile">
                {props => <UserProfileParallax {...props} profileID={userProfile?.id} />}
            </Tab.Screen>
            {/* <Tab.Screen name="Notifications" component={FeedList} /> */}
            <Tab.Screen name="AddSite" component={SiteSubmitterRouter} options={{ tabBarLabel: "Site Add", unmountOnBlur: true }} />

            {PARTNER_ACCOUNT_STATUS &&
                <Tab.Screen name="Itinerary" component={ShopListParallax} options={{ tabBarLabel: "My Centres" }} />}
        </Tab.Navigator>

    );

    /**
                                                             * Returns the icon name and label for each tab based on route.
                                                             * @param route The route name of the current tab
                                                             * @returns Object literal containing Icon name and label strings
                                                             */
    function getTabProps(route: string): { icon: string; label: string } {
        switch (route) {
            case "Home": return { icon: "map-outlined", label: t("BottomTabBar.home") };
            case "Profile": return { icon: "person", label: t("BottomTabBar.profile") };
            case "Notifications": return { icon: "bell-ring-outline", label: t("BottomTabBar.notifications") };
            case "AddSite": return { icon: "anchor-plus", label: t("BottomTabBar.addsite") };
            case "Guides": return { icon: "question-mark", label: t("BottomTabBar.guides") };
            case "Itinerary": return { icon: "diving-scuba-flag", label: t("BottomTabBar.itinerary") };
            default: throw new Error(`Unknown route: ${route}`);
        }
    }
}
