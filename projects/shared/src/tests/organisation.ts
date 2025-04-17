/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

export const organisation = {
  metadata: {
    $schema: 'https://bib.rero.ch/schemas/organisations/organisation-v0.0.1.json',
    address: 'Via Challand 132, 11100 Aosta',
    code: 'aoste',
    collection_enabled_on_public_view: true,
    current_budget_pid: '1',
    default_currency: 'EUR',
    name: 'Réseau des bibliothèques du Canton d\'Aoste',
    online_harvested_source: ['ebibliomedia'],
    pid: '1'
  }
}

export const location = {
  metadata: {
    $schema: '"https://bib.rero.ch/schemas/locations/location-v0.0.1.json',
    allow_request: true,
    code: 'AOSTE-CANT1-BIBLIOGR',
    library: {
      pid: '1',
      type: 'lib'
    },
    name: 'Bibliographie valdôtaine',
    organisation: {
      pid: '1',
      type: 'org'
    },
    pid: '2'
  }
};

