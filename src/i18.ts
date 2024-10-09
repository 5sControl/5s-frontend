import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import EN from './locales/en/translation.json'
import RU from './locales/ru/translation.json'

const resources = {
    en: {
        translation: EN
    },
    ru: {
        translation: RU
    }
};
const DETECTION_OPTIONS = {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
};
const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
i18n.use(initReactI18next)
    .init({
        lng: savedLanguage,
        detection: DETECTION_OPTIONS,
        resources,
        fallbackLng: 'en',
    });
export const changeI18Language = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem('i18nextLng', language);
};
export default i18n;
