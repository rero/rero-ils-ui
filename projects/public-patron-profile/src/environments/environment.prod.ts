// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
export const environment = {
  production: true,
  projectTitle: 'RERO ILS',
  apiBaseUrl: "",
  $refPrefix: "https://bib.rero.ch",
  languages: ["fr", "de", "it", "en"],
  globalViewName: "global",
  translationsURLs: [
    "/static/node_modules/@rero/rero-ils-ui/dist/public-patron-profile/browser/assets/rero-ils-ui/shared/i18n/${lang}.json",
    "/static/node_modules/@rero/rero-ils-ui/dist/public-patron-profile/browser/assets/rero-ils-ui/public-search/i18n/${lang}.json",
    "/api/translations/${lang}.json",
  ],
};
