// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  projectTitle: 'Admin',
  apiBaseUrl: '',
  $refPrefix: 'https://bib.rero.ch',
  defaultLanguage: 'en',
  adminRoles: ['system_librarian', 'librarian'],
  // no version in development: translation files are never cached
  translationsVersion: '',
  translationsURLs: [
    { url: '/assets/rero-ils-ui/shared/i18n/${lang}.json', versioned: true },
    { url: '/assets/rero-ils-ui/admin/i18n/${lang}.json', versioned: true },
    '/api/translations/${lang}.json'
  ],
  librarySwitchCheckParamsUrl: ['new', 'edit'],
  ngCoreAssetsUrl: '',
};
