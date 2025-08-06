import React, { useContext } from "react";
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
import { FullScreenModalContext } from "../../contexts/fullScreenModalContext";

type FinishScreenNavigationProp = NativeStackNavigationProp<
  OnboardingRoutes,
  "Finish"
>;

export default function FinishScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<FinishScreenNavigationProp>();
  const { setFullScreenModal } = useContext(FullScreenModalContext);

  const onPress = async () => {
    setFullScreenModal(false);
  };

  return (
    <View style={styles.pageContent}>
      <Text style={styles.title}>{t("OnBoarding.doneTitle")}</Text>

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
            <Text style={styles.content}>{t("OnBoarding.doneContent")}</Text>
          </ScrollView>
        </View>
      </MaskedView>

      <View style={styles.buttonBox}>
        <TouchableWithoutFeedback onPress={() => onPress()}>
          <View style={styles.buttonOne}>
            <Text style={styles.buttonOneText}>{t("Common.finish")}</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
}
