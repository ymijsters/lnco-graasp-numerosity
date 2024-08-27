/* eslint-disable */

import i18next from 'i18next';

import { initLang } from './languages.js';
// Import your translation files
import ca from '../../locales/en/en.json';
import de from '../../locales/de/de.json';
import en from '../../locales/en/en.json';
import es from '../../locales/es/es.json';
import fr from '../../locales/fr/fr.json';

const fallback_lang: string = 'en';

const lang: string = initLang(['en', 'fr', 'es', 'ca', 'de'], fallback_lang);


// Initialize i18next
i18next.init(
  {
    lng: lang, // default language
    fallbackLng: fallback_lang,
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      es: { translation: es },
      ca: { translation: ca },
      de: { translation: de },
    },
    interpolation: {
      escapeValue: false, // not needed for Node.js
    },
  },
  (err) => {
    if (err) console.error('i18next initialization error:', err);
  },
);


export default i18next;
