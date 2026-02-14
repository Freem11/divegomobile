import {
  View,
  Text,
  ScrollView,
  TouchableWithoutFeedback
} from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";
import { Platform } from "react-native";

import { colors } from "../../styles";

import styles from "./styles";

/**
 * Configuration params for all Onboarding related screens except DiverName screen as it's different from others.
 */
export type OnboardingConfigParams = {
  title: string, content: string,
  buttonOneText: string, buttonOnePressCallback: () => void,
  buttonTwoText?: string, buttonTwoPressCallback?: () => void
};

export function OnboardingTemplateLayout(params: OnboardingConfigParams) {
  const { t } = useTranslation();

  /**
       * For Android only.
       * If Android users have the 3 button Bottom system bar navigation enabled instead of gesture navigation,
       * then we need to add additional space underneath the button(s) so that the button(s) do not overlap the Bottom system bar.
       */
  const insets = useSafeAreaInsets();
  const bottomInset: number | null = (insets.bottom > 0) ? insets.bottom : null;
  const buttonBottomPosition: number = (Platform.OS === "android" && bottomInset) ? bottomInset : scale(20);

  return (
    <View style={styles.pageContent}>
      <Text style={styles.title}>{t(params.title)}</Text>

      <MaskedView
        maskElement={(
          <LinearGradient
            style={{ flex: 1 }}
            colors={[colors.primaryBlue, "transparent"]}
            start={{ x: 0.5, y: 0.7 }}
          >
          </LinearGradient>
        )}
      >
        <View style={styles.scrollViewBox}>
          <ScrollView style={styles.scrollView}>
            <Text style={styles.content}>{t(params.content)}</Text>
          </ScrollView>
        </View>
      </MaskedView>

      <View style={[styles.buttonBox, { bottom: buttonBottomPosition }]}>
        <TouchableWithoutFeedback onPress={params.buttonOnePressCallback}>
          <View style={styles.buttonOne}>
            <Text style={styles.buttonOneText}>{t(params.buttonOneText)}</Text>
          </View>
        </TouchableWithoutFeedback>

        {params.buttonTwoText && (
          <TouchableWithoutFeedback onPress={params.buttonTwoPressCallback}>
            <View style={styles.buttonTwo}>
              <Text style={styles.buttonTwoText}>
                {t(params.buttonTwoText)}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
    </View>
  );
}
