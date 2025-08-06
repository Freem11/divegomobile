import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { OnboardingRoutes } from "./onboardingNavigator";
import {
    View,
    Text,
    ScrollView,
    TouchableWithoutFeedback
} from "react-native";
import styles from "./styles"
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { registerForPushNotificationsAsync } from "../notificationsRegistery";

type NotificationsScreenNavigationProp = NativeStackNavigationProp<
    OnboardingRoutes,
    "Notifications"
>;

export default function NotificationsScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<NotificationsScreenNavigationProp>();

    const moveToNextPage = () => {
        navigation.replace("Finish");
    }

    const onPress = async (navigation: NotificationsScreenNavigationProp) => {
        await registerForPushNotificationsAsync();
        moveToNextPage();
    };

    return (
        <View style={styles.pageContent}>
            <Text style={styles.title}>{t("OnBoarding.notificationsTitle")}</Text>

            <MaskedView
                maskElement={(
                    <LinearGradient
                        style={{ flex: 1 }}
                        colors={["green", "transparent"]}
                        start={{ x: 0.5, y: 0.7 }}
                    >
                    </LinearGradient>
                )}
            >
                <View style={styles.scrollViewBox}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.content}>{t("OnBoarding.notificationsContent")}</Text>
                    </ScrollView>
                </View>
            </MaskedView>

            <View style={styles.buttonBox}>
                <TouchableWithoutFeedback onPress={() => onPress(navigation)}>
                    <View style={styles.buttonOne}>
                        <Text style={styles.buttonOneText}>{t("Common.accept")}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => moveToNextPage()}>
                    <View style={styles.buttonTwo}>
                        <Text style={styles.buttonTwoText}>
                            {t("Common.optOut")}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    );
}
