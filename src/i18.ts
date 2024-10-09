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
i18n.use(initReactI18next)
    .init({
        fallbackLng: 'en',
        resources,
        debug: false,
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
