/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  projectTitle: 'Admin',
  apiBaseUrl: '',
  $refPrefix: 'https://bib.rero.ch',
  languages: ['fr', 'de', 'it', 'en'],
  defaultLanguage: 'en',
  adminRoles: ['system_librarian', 'librarian'],
  translationsURLs: [
    '/assets/rero-ils-ui/shared/i18n/${lang}.json',
    '/assets/rero-ils-ui/admin/i18n/${lang}.json',
    '/api/translations/${lang}.json'
  ],
  librarySwitchCheckParamsUrl: ['new', 'edit']
};
