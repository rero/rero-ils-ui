// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { version } from '../../../../package.json';

export const environment = {
  production: true,
  projectTitle: 'Admin',
  apiBaseUrl: '',
  $refPrefix: 'https://bib.rero.ch',
  defaultLanguage: 'en',
  adminRoles: ['system_librarian', 'librarian'],
  translationsVersion: version,
  translationsURLs: [
    { url: '/static/node_modules/@rero/rero-ils-ui/dist/admin/browser/assets/rero-ils-ui/shared/i18n/${lang}.json', versioned: true },
    { url: '/static/node_modules/@rero/rero-ils-ui/dist/admin/browser/assets/rero-ils-ui/admin/i18n/${lang}.json', versioned: true },
    '/api/translations/${lang}.json'
  ],
  ngCoreAssetsUrl: '/static/node_modules/@rero/rero-ils-ui/dist/admin/browser',
  librarySwitchCheckParamsUrl: ['new', 'edit']
};
