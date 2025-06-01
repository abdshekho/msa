import type { Locale } from "./i18n-config";
import en from './dictionaries/en.json';
import ar from './dictionaries/ar.json';

const dictionaries = {
    en,
    ar,
};

export const getClientDictionary = (locale: Locale) =>
    dictionaries[locale] ?? dictionaries.en;