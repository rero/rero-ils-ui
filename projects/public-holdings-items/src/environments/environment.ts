// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: '',
  $refPrefix: 'https://bib.rero.ch',
  languages: ['fr', 'de', 'it', 'en'],
  globalViewName: 'global',
  translationsURLs: [
    '/static/node_modules/@rero/rero-ils-ui/dist/public-search/assets/rero-ils-ui/public-search/i18n/${lang}.json',
    '/api/translations/${lang}.json'
  ]
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
