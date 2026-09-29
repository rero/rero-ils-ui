// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { version } from '../../../../package.json';

export const environment = {
  production: true,
  projectTitle: 'RERO ILS',
  apiBaseUrl: "",
  $refPrefix: "https://bib.rero.ch",
  globalViewName: "global",
  translationsVersion: version,
  translationsURLs: [
    { url: "/static/node_modules/@rero/rero-ils-ui/dist/public-patron-profile/browser/assets/rero-ils-ui/shared/i18n/${lang}.json", versioned: true },
    { url: "/static/node_modules/@rero/rero-ils-ui/dist/public-patron-profile/browser/assets/rero-ils-ui/public-search/i18n/${lang}.json", versioned: true },
    "/api/translations/${lang}.json",
  ],
  ngCoreAssetsUrl: '/static/node_modules/@rero/rero-ils-ui/dist/public-patron-profile/browser',
};
