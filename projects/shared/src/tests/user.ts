// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { User, UserConstructorData } from '../lib/classes/user';

export function makeUser(data: UserConstructorData): User {
  return new User(data);
}

export const testPermissions = [
  "acac-create",
  "acac-search",
  "acin-create",
  "acin-search",
  "acol-create",
  "acol-search",
  "acor-create",
  "acor-search",
  "acre-create",
  "acre-search",
  "acrl-create",
  "acrl-search",
  "access-circulation",
  "admin-ui-access",
  "budg-search",
  "can-use-debug-mode",
  "cipo-create",
  "cipo-search",
  "coll-create",
  "coll-search",
  "doc-create",
  "doc-search",
  "hold-create",
  "hold-search",
  "illr-create",
  "illr-search",
  "item-create",
  "item-search",
  "itty-create",
  "itty-search",
  "late-issue-management",
  "lib-create",
  "lib-search",
  "loan-search",
  "loc-create",
  "loc-search",
  "lofi-create",
  "lofi-search",
  "notif-create",
  "notif-search",
  "oplg-search",
  "org-search",
  "ptre-create",
  "ptre-search",
  "ptrn-create",
  "ptrn-search",
  "pttr-create",
  "pttr-search",
  "ptty-create",
  "ptty-search",
  "tmpl-create",
  "tmpl-search",
  "vndr-create",
  "vndr-search"
];

/** User with 2 patrons record */
export const testUserPatronWithSettings = {
  settings: {
    baseUrl: 'https://bib.rero.ch',
    agentSources: ['idref', 'gnd', 'rero'],
    agentAgentTypes: { 'bf:Person': 'persons', 'bf:Organisation': 'corporate-bodies' },
    agentLabelOrder: { de: ['gnd', 'idref', 'rero'], fallback: 'fr', fr: ['idref', 'rero', 'gnd'] },
    globalView: 'global',
    language: 'fr',
    operationLogs: { documents: 'doc', holdings: 'hold', items: 'item' },
    documentAdvancedSearch: false,
    userProfile: { readOnly: false, readOnlyFields: [] },
    availableLanguages: [{ code: 'fr', name: 'French' }]
  },
  permissions: testPermissions,
  user: {
    id: 8,
    birth_date: '1969-06-07',
    business_phone: '+39324993588',
    city: 'Aosta',
    country: 'it',
    email: 'reroilstest+simonetta@gmail.com',
    first_name: 'Simonetta',
    gender: 'female',
    home_phone: '+39324993585',
    keep_history: true,
    last_name: 'Casalini',
    postal_code: '11100',
    roles: ['patron'],
    street: 'Via Croix Noire 3',
    username: 'simonetta',
  },
  patrons: [
    {
      pid: '1',
      second_address: { street: 'Rue des Remparts', postal_code: '1950', city: 'Sion', country: 'sw' },
      patron: {
        barcode: ['2010023488'],
        type: { pid: '2' },
        expiration_date: new Date('2024-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [{ pid: '1', organisation: { pid: '2', code: 'org1', name: 'Organisation 1', currency: 'CHF' } }]
      },
      organisation: { pid: '2', code: 'org1', name: 'Organisation 1', currency: 'CHF' },
      roles: ['patron']
    },
    {
      pid: '2',
      libraries: [{ organisation: { pid: '1' }, pid: '4' }],
      organisation: { code: 'aoste', currency: 'EUR', name: 'R\u00e9seau des biblioth\u00e8ques du Canton d\'Aoste', pid: '1' },
      roles: ['system_librarian', 'librarian']
    }
  ],
};

/** User with 2 patron records (patron and librarian, system_librarian) */
export const testUserPatronLibrarian: UserConstructorData = {
  user: {
    id: 1,
    first_name: 'first_name',
    last_name: 'last_name',
    birth_date: '1966-01-01',
    gender: 'male',
    username: 'first_last',
    street: 'Av. de la Gare',
    postal_code: '1920',
    city: 'Martigny',
    country: 'sw',
    keep_history: false,
    email: 'foo@bar.com',
    roles: ['patron'],
  },
  patrons: [
    {
      pid: '1',
      second_address: { street: 'Rue des Remparts', postal_code: '1950', city: 'Sion', country: 'sw' },
      patron: {
        barcode: ['2010023488'],
        type: { pid: '2' },
        expiration_date: new Date('2024-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [{ pid: '1', organisation: { pid: '2', code: 'org1', name: 'Organisation 1', currency: 'CHF' } }]
      },
      organisation: { pid: '2', code: 'org1', name: 'Organisation 1', currency: 'CHF' },
      roles: ['patron']
    },
    {
      pid: '1',
      libraries: [{ organisation: { pid: '1' }, pid: '4' }],
      organisation: { code: 'aoste', currency: 'EUR', name: 'R\u00e9seau des biblioth\u00e8ques du Canton d\'Aoste', pid: '1' },
      roles: ['system_librarian', 'librarian']
    }
  ],
  permissions: testPermissions,
};


/** User with 2 patrons record (multiple organisation) */
export const testUserPatronMultipleOrganisationsWithSettings = {
  settings: {
    baseUrl: 'https://bib.rero.ch',
    agentSources: ['idref', 'gnd', 'rero'],
    agentAgentTypes: { 'bf:Person': 'persons', 'bf:Organisation': 'corporate-bodies' },
    agentLabelOrder: { de: ['gnd', 'idref', 'rero'], fallback: 'fr', fr: ['idref', 'rero', 'gnd'] },
    globalView: 'global',
    language: 'fr',
    operationLogs: { documents: 'doc', holdings: 'hold', items: 'item' },
    documentAdvancedSearch: false,
    userProfile: { readOnly: false, readOnlyFields: [] },
    availableLanguages: [{ code: 'fr', name: 'French' }]
  },
  permissions: [],
  user: {
    id: 8,
    birth_date: '1969-06-07',
    business_phone: '+39324993588',
    city: 'Aosta',
    country: 'it',
    email: 'reroilstest+simonetta@gmail.com',
    first_name: 'Simonetta',
    gender: 'female',
    home_phone: '+39324993585',
    keep_history: true,
    last_name: 'Casalini',
    postal_code: '11100',
    roles: ['patron'],
    street: 'Via Croix Noire 3',
    username: 'simonetta',
  },
  patrons: [
    {
      pid: '1',
      second_address: { street: 'Rue des Remparts', postal_code: '1950', city: 'Sion', country: 'sw' },
      patron: {
        barcode: ['2010023488'],
        type: { pid: '2' },
        expiration_date: new Date('2024-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [{ pid: '1', organisation: { pid: '2', code: 'org1', name: 'Organisation 1', currency: 'CHF' } }]
      },
      organisation: { pid: '2', code: 'org1', name: 'Organisation 1', currency: 'CHF' },
      roles: ['patron']
    },
    {
      pid: '10',
      second_address: { street: 'Rue des Remparts', postal_code: '1950', city: 'Sion', country: 'sw' },
      patron: {
        barcode: ['2010023489'],
        type: { pid: '2' },
        expiration_date: new Date('2025-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [{ pid: '1', organisation: { pid: '3', code: 'org2', name: 'Organisation 2', currency: 'CHF' } }]
      },
      organisation: { pid: '3', code: 'org2', name: 'Organisation 2', currency: 'CHF' },
      roles: ['patron']
    },
  ],
};


export const testUserLibrarianWithSettings = {
  settings: {
    baseUrl: 'https://bib.rero.ch',
    agentSources: ['idref', 'gnd', 'rero'],
    agentAgentTypes: {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    },
    agentLabelOrder: {
      de: ['gnd', 'idref', 'rero'],
      fallback: 'fr',
      fr: ['idref', 'rero', 'gnd']
    },
    globalView: 'global',
    language: 'fr',
    operationLogs: { documents: 'doc', holdings: 'hold', items: 'item' },
    documentAdvancedSearch: false,
    userProfile: { readOnly: false, readOnlyFields: [] },
    availableLanguages: [{ code: 'fr', name: 'French' }]
  },
  permissions: testPermissions,
  user: {
    id: 8,
    birth_date: '1969-06-07',
    business_phone: '+39324993588',
    city: 'Aosta',
    country: 'it',
    email: 'reroilstest+simonetta@gmail.com',
    first_name: 'Simonetta',
    gender: 'female',
    home_phone: '+39324993585',
    keep_history: true,
    last_name: 'Casalini',
    postal_code: '11100',
    roles: ['patron'],
    street: 'Via Croix Noire 3',
    username: 'simonetta',
  },
  patrons: [
    {
      pid: '2',
      libraries: [
        { organisation: { pid: '1' }, pid: '2' },
        { organisation: { pid: '1' }, pid: '3' },
        { organisation: { pid: '1' }, pid: '4' }
      ],
      organisation: {
        code: 'aoste',
        currency: 'EUR',
        name: 'R\u00e9seau des biblioth\u00e8ques du Canton d\'Aoste',
        pid: '1'
      },
      roles: ['librarian']
    }
  ],
};

export const testPatron = {
  metadata: {
    $schema: 'https://bib.rero.ch/schemas/patrons/patron-v0.0.1.json',
    birth_date: '1974-03-21',
    city: 'Fribourg',
    email: 'john@doe.com',
    first_name: 'John',
    home_phone: '+41261234567',
    keep_history: true,
    last_name: 'Doe',
    organisation: {
      pid: '1'
    },
    patron: {
      barcode: ['2050124312'],
      communication_channel: 'email',
      communication_language: 'fre',
      expiration_date: '2100-01-01',
      subscriptions: [
        {
          end_date: '2026-02-20',
          patron_transaction: {
            pid: '3',
            type: 'pttr'
          },
          patron_type: {
            pid: '1',
            type: 'ptty'
          },
          start_date: '2025-02-20'
        }
      ],
      type: {
        pid: '1',
        type: 'ptty'
      },
    },
    pid: '1',
    postal_code: '1920',
    roles: ['patron'],
    street: 'Av. de la Gare',
    user_id: 14,
    username: 'john.doe'
  }
}
