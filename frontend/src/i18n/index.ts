import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import uz_cyrl from './locales/uz_cyrl.json';

const savedLang = localStorage.getItem('lummy_language') || 'ru';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      uz: { translation: uz },
      uz_cyrl: { translation: uz_cyrl },
    },
    lng: savedLang,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  });

export default i18n;
