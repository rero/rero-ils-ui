// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // no version in development: translation files are never cached
  translationsVersion: '',
  translationsURLs: [
    { url: "/assets/rero-ils-ui/shared/i18n/${lang}.json", versioned: true },
    { url: "/assets/rero-ils-ui/public-search/i18n/${lang}.json", versioned: true },
    "/api/translations/${lang}.json",
  ],
  ngCoreAssetsUrl: '',
};
