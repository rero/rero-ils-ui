export const environment = {
  production: true,
  apiBaseUrl: "",
  $refPrefix: "https://bib.rero.ch",
  languages: ["fr", "de", "it", "en"],
  globalViewName: "global",
  translationsURLs: [
    "/static/node_modules/@rero/rero-ils-ui/dist/public-holdings-items/browser/assets/rero-ils-ui/shared/i18n/${lang}.json",
    "/static/node_modules/@rero/rero-ils-ui/dist/public-holdings-items/browser/assets/rero-ils-ui/public-search/i18n/${lang}.json",
    "/api/translations/${lang}.json",
  ],
};
