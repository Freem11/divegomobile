import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

const resources = {
  en: {
    auth: require("./locale/en/auth.json"),
    common: require("./locale/en/common.json"),
    validators: require("./locale/en/validators.json"),
  },
  es: {
    auth: require("./locale/es/auth.json"),
    common: require("./locale/es/common.json"),
    validators: require("./locale/es/validators.json"),
  },
};

export const initI18n = async () => {
  const locales = getLocales();
  const deviceLang = locales?.[0]?.languageCode ?? "en";
  const selectedLanguage = deviceLang in resources ? deviceLang : "en";

  await i18n.use(initReactI18next).init({
    resources,
    lng: selectedLanguage,
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["auth", "common", "validators"],
    interpolation: { escapeValue: false },
  });
};

export const setLanguage = async (lang: string) => {
  // function to set the selected language at some point.
  await i18n.changeLanguage(lang);
  // await AsyncStorage.setItem(LANG_KEY, lang);
};

export { i18n };
