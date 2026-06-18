// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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

