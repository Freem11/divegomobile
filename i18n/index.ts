import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { getLocales } from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";

import en from "./en.json";
import es from "./es.json";

const LANG_KEY = "user-language";

export const availableLanguages = {
  en: "English",
  es: "Español",
};

const resources = {
  en: { translation: en },
  es: { translation: es },
};

export const initI18n = async () => {
  const storedLang = await AsyncStorage.getItem(LANG_KEY);

  const locales = getLocales();
  console.log("locales", locales);
  // const deviceLang = locales?.[0]?.languageCode || "en";

  // const selectedLanguage =
  //   storedLang || (deviceLang in resources ? deviceLang : "en");

  // await i18n.use(initReactI18next).init({
  //   resources,
  //   lng: selectedLanguage,
  //   fallbackLng: "en",
  //   interpolation: {
  //     escapeValue: false,
  //   },
  // });
};

export const setLanguage = async (lang: string) => {
  await i18n.changeLanguage(lang);
  await AsyncStorage.setItem(LANG_KEY, lang);
};

export { i18n };
