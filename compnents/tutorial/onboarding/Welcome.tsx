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

type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Welcome"
>;

export default function WelcomeScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <View style={styles.pageContent}>
      <Text style={styles.title}>{t("OnBoarding.welcomeTitle")}</Text>

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
            <Text style={styles.content}>{t("OnBoarding.welcomeContent")}</Text>
          </ScrollView>
        </View>
      </MaskedView>

      <View style={styles.buttonBox}>
        <TouchableWithoutFeedback onPress={() => onPress(navigation)}>
          <View style={styles.buttonOne}>
            <Text style={styles.buttonOneText}>{t("Common.next")}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}

const onPress = async (navigation: WelcomeScreenNavigationProp) => {
  navigation.replace("DiverName");
};