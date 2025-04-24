import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { chLocale } from "./locales/ch";
import { enLocale } from "./locales/en";
import { ruLocale } from "./locales/ru";

export const defaultNS = "common";

export const localeResources = {
	ru: ruLocale,
	en: enLocale,
	ch: chLocale,
};

export const APP_LANGUAGES = {
	ru: "ru",
	en: "en",
	ch: "ch",
} as const;

export const changeLanguage = (lang: APP_LANGUAGES_TYPE) => {
	i18n.changeLanguage(lang);
};

i18n.use(initReactI18next).init({
	lng: APP_LANGUAGES.en,
	fallbackLng: APP_LANGUAGES.en,
	keySeparator: false,
	returnNull: false,
	interpolation: {
		escapeValue: false,
	},
	resources: localeResources,
});

export type APP_LANGUAGES_TYPE = keyof typeof APP_LANGUAGES;

export default i18n;
