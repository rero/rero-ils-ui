import { version } from '../../../../package.json';

export const environment = {
  production: true,
  translationsVersion: version,
  translationsURLs: [
    { url: "/static/node_modules/@rero/rero-ils-ui/dist/search-bar/browser/assets/rero-ils-ui/shared/i18n/${lang}.json", versioned: true },
    { url: "/static/node_modules/@rero/rero-ils-ui/dist/search-bar/browser/assets/rero-ils-ui/public-search/i18n/${lang}.json", versioned: true },
    "/api/translations/${lang}.json",
  ],
  ngCoreAssetsUrl: '/static/node_modules/@rero/rero-ils-ui/dist/search-bar/browser',
};
