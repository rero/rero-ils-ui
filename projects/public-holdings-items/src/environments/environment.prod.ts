export const environment = {
  production: true,
  apiBaseUrl: '',
  $refPrefix: 'https://ils.rero.ch',
  languages: ['fr', 'de', 'it', 'en'],
  globalViewName: 'global',
  translationsURLs: [
    '/static/node_modules/@rero/rero-ils-ui/dist/public-search/assets/rero-ils-ui/public-search/i18n/${lang}.json',
    '/api/translations/${lang}.json'
  ]
};
