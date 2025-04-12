import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";

import auth from "./en/auth.json";
import common from "./en/common.json";
import validators from "./en/validators.json";

const resources = {
  en: {
    auth,
    common,
    validators,
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
