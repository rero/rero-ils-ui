// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

export const environment = {
  production: true,
  projectTitle: 'Admin',
  apiBaseUrl: '',
  $refPrefix: 'https://bib.rero.ch',
  languages: ['fr', 'de', 'it', 'en'],
  defaultLanguage: 'en',
  adminRoles: ['system_librarian', 'librarian'],
  translationsURLs: [
    '/static/node_modules/@rero/rero-ils-ui/dist/admin/browser/assets/rero-ils-ui/shared/i18n/${lang}.json',
    '/static/node_modules/@rero/rero-ils-ui/dist/admin/browser/assets/rero-ils-ui/admin/i18n/${lang}.json',
    '/api/translations/${lang}.json'
  ],
  librarySwitchCheckParamsUrl: ['new', 'edit']
};
