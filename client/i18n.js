import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .init({
    // we init with resources
    detection: {
      // order and from where user language should be detected
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],

      // keys or params to lookup language from
      lookupQuerystring: 'lng',
      lookupCookie: 'i18next',
      lookupLocalStorage: 'i18nextLng',
      lookupFromPathIndex: 0,
      lookupFromSubdomainIndex: 0,

      // cache user language on
      caches: ['localStorage', 'cookie'],
      excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

      // optional expire and domain for set cookie
      cookieMinutes: 10,
      cookieDomain: 'myDomain',

      // optional htmlTag with lang attribute, the default is:
      htmlTag: document.documentElement
    },
    resources: {
      en: {
        translations: {
          "Welcome to React.js": "Welcome to React.js",
          "Declarative": "Declarative",
          "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.": "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.",
          "Declarative views make your code more predictable and easier to debug.": "Declarative views make your code more predictable and easier to debug."
        }
      },
      el: {
        translations: {
          "Welcome to React.js": "Καλώς 'Ηρθατε στο React.js!",
          "Declarative": "Δηλωτικό",
          "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.": "καθιστά ανώφελη τη δημιουργία διαδραστικών διεπαφών χρήστη. Σχεδιάστε απλές προβολές για κάθε κράτος στο δικό σας\\n\" +\n" +
          "                    εφαρμογή και το React θα ενημερώσει αποτελεσματικά και θα αποδώσει τα σωστά στοιχεία όταν τα δεδομένα σας " +
          "                    αλλαγές.",
          "Declarative views make your code more predictable and easier to debug.": "Οι δηλωτικές προβολές καθιστούν τον κώδικα πιο προβλέψιμο και πιο εύκολο στον εντοπισμό σφαλμάτων."
        }
      },
      it: {
        translations: {
          "WCCM Online Meditation Groups": "WCCM Gruppi di Meditazione Online",
          "Welcome to React.js": "Benvenuto in React.js",
          "Declarative": "Dichiarativo",
          "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes.": "React rende facile creare UI interattive. Disegna semplici viste per ogni stato della ta app, e React aggiornerà solo i componenti che devono essere aggiornati",
          "Declarative views make your code more predictable and easier to debug.": "Le viste dichiarative rendono il tuo codice più prevedibile e facile da debuggare."

        }
      },
    },
    fallbackLng: 'en',
    debug: true,

    // have a common namespace used around the full app
    ns: ['translations'],
    defaultNS: 'translations',

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false, // not needed for react!!
      formatSeparator: ','
    },

    react: {
      wait: true
    }
  });

export default i18n;
