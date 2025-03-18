export const environment = {
  production: true,
  translationsURLs: [
    "/static/node_modules/@rero/rero-ils-ui/dist/search-bar/browser/assets/rero-ils-ui/shared/i18n/${lang}.json",
    "/static/node_modules/@rero/rero-ils-ui/dist/search-bar/browser/assets/rero-ils-ui/public-search/i18n/${lang}.json",
    "/api/translations/${lang}.json",
  ],
};
