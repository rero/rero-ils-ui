/*
 * RERO ILS UI
 * Copyright (C) 2021-2022 RERO
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
import { IUser } from '../lib/class/user';

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
  birth_date: '1969-06-07',
  business_phone: '+39324993588',
  city: 'Aosta',
  country: 'it',
  email: 'reroilstest+simonetta@gmail.com',
  first_name: 'Simonetta',
  gender: 'female',
  home_phone: '+39324993585',
  id: 8,
  keep_history: true,
  last_name: 'Casalini',
  patrons: [
    {
      pid: '1',
      second_address: {
        street: 'Rue des Remparts',
        postal_code: '1950',
        city: 'Sion',
        country: 'sw'
      },
      patron: {
        barcode: ['2010023488'],
        type: {
          pid: '2'
        },
        expiration_date: new Date('2024-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [
          {
            pid: '1',
            organisation: {
              pid: '2',
              code: 'org1',
              name: 'Organisation 1',
              currency: 'CHF'
            }
          }
        ]
      },
      organisation: {
        pid: '2',
        code: 'org1',
        name: 'Organisation 1',
        currency: 'CHF'
      },
      roles: ['patron']
    },
    {
      pid: '2',
      libraries: [
        {
          organisation: {
            pid: '1'
          },
          pid: '4'
        }
      ],
      organisation: {
        code: 'aoste',
        currency: 'EUR',
        name: 'R\u00e9seau des biblioth\u00e8ques du Canton d\'Aoste',
        pid: '1'
      },
      roles: [
        'system_librarian',
        'librarian'
      ]
    }
  ],
  postal_code: '11100',
  roles: [
    'patron'
  ],
  settings: {
    baseUrl: 'https://bib.rero.ch',
    agentSources: [
      'idref',
      'gnd',
      'rero'
    ],
    agentAgentTypes: {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    },
    agentLabelOrder: {
      de: [
        'gnd',
        'idref',
        'rero'
      ],
      fallback: 'fr',
      fr: [
        'idref',
        'rero',
        'gnd'
      ]
    },
    globalView: 'global',
    language: 'fr',
    operationLogs: {
      documents: 'doc',
      holdings: 'hold',
      items: 'item'
    },
    documentAdvancedSearch: false,
    userProfile: {
      readOnly: false,
      readOnlyFields: []
    }
  },
  street: 'Via Croix Noire 3',
  username: 'simonetta',
  permissions: testPermissions
};

/** User with 2 patron records (patron and librarian, system_librarian) */
export const testUserPatronLibrarian: IUser = {
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
  patrons: [
    {
      pid: '1',
      second_address: {
        street: 'Rue des Remparts',
        postal_code: '1950',
        city: 'Sion',
        country: 'sw'
      },
      patron: {
        barcode: ['2010023488'],
        type: {
          pid: '2'
        },
        expiration_date: new Date('2024-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [
          {
            pid: '1',
            organisation: {
              pid: '2',
              code: 'org1',
              name: 'Organisation 1',
              currency: 'CHF'
            }
          }
        ]
      },
      organisation: {
        pid: '2',
        code: 'org1',
        name: 'Organisation 1',
        currency: 'CHF'
      },
      roles: ['patron']
    },
    {
      pid: '1',
      libraries: [
        {
          organisation: {
            pid: '1'
          },
          pid: '4'
        }
      ],
      organisation: {
        code: 'aoste',
        currency: 'EUR',
        name: 'R\u00e9seau des biblioth\u00e8ques du Canton d\'Aoste',
        pid: '1'
      },
      roles: [
        'system_librarian',
        'librarian'
      ]
    }
  ],
  permissions: testPermissions
};


/** User with 2 patrons record (multiple organisation) */
export const testUserPatronMultipleOrganisationsWithSettings = {
  birth_date: '1969-06-07',
  business_phone: '+39324993588',
  city: 'Aosta',
  country: 'it',
  email: 'reroilstest+simonetta@gmail.com',
  first_name: 'Simonetta',
  gender: 'female',
  home_phone: '+39324993585',
  id: 8,
  keep_history: true,
  last_name: 'Casalini',
  patrons: [
    {
      pid: '1',
      second_address: {
        street: 'Rue des Remparts',
        postal_code: '1950',
        city: 'Sion',
        country: 'sw'
      },
      patron: {
        barcode: ['2010023488'],
        type: {
          pid: '2'
        },
        expiration_date: new Date('2024-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [
          {
            pid: '1',
            organisation: {
              pid: '2',
              code: 'org1',
              name: 'Organisation 1',
              currency: 'CHF'
            }
          }
        ]
      },
      organisation: {
        pid: '2',
        code: 'org1',
        name: 'Organisation 1',
        currency: 'CHF'
      },
      roles: ['patron']
    },
    {
      pid: '10',
      second_address: {
        street: 'Rue des Remparts',
        postal_code: '1950',
        city: 'Sion',
        country: 'sw'
      },
      patron: {
        barcode: ['2010023489'],
        type: {
          pid: '2'
        },
        expiration_date: new Date('2025-01-01'),
        communication_channel: 'email',
        communication_language: 'fra',
        blocked: false,
        libraries: [
          {
            pid: '1',
            organisation: {
              pid: '3',
              code: 'org2',
              name: 'Organisation 2',
              currency: 'CHF'
            }
          }
        ]
      },
      organisation: {
        pid: '3',
        code: 'org2',
        name: 'Organisation 2',
        currency: 'CHF'
      },
      roles: ['patron']
    },
  ],
  postal_code: '11100',
  roles: [
    'patron'
  ],
  settings: {
    baseUrl: 'https://bib.rero.ch',
    agentSources: [
      'idref',
      'gnd',
      'rero'
    ],
    agentAgentTypes: {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    },
    agentLabelOrder: {
      de: [
        'gnd',
        'idref',
        'rero'
      ],
      fallback: 'fr',
      fr: [
        'idref',
        'rero',
        'gnd'
      ]
    },
    globalView: 'global',
    language: 'fr',
    operationLogs: {
      documents: 'doc',
      holdings: 'hold',
      items: 'item'
    },
    documentAdvancedSearch: false,
    userProfile: {
      readOnly: false,
      readOnlyFields: []
    }
  },
  street: 'Via Croix Noire 3',
  username: 'simonetta',
  permissions: []
};


export const testUserLibrarianWithSettings = {
  birth_date: '1969-06-07',
  business_phone: '+39324993588',
  city: 'Aosta',
  country: 'it',
  email: 'reroilstest+simonetta@gmail.com',
  first_name: 'Simonetta',
  gender: 'female',
  home_phone: '+39324993585',
  id: '8',
  keep_history: true,
  last_name: 'Casalini',
  patrons: [
    {
      pid: '2',
      libraries: [
        {
          organisation: {
            pid: '1'
          },
          pid: '2'
        },
        {
          organisation: {
            pid: '1'
          },
          pid: '3'
        },
        {
          organisation: {
            pid: '1'
          },
          pid: '4'
        }
      ],
      organisation: {
        code: 'aoste',
        currency: 'EUR',
        name: 'R\u00e9seau des biblioth\u00e8ques du Canton d\'Aoste',
        pid: '1'
      },
      roles: [
        'librarian'
      ]
    }
  ],
  postal_code: '11100',
  roles: [
    'patron'
  ],
  settings: {
    baseUrl: 'https://bib.rero.ch',
    agentSources: [
      'idref',
      'gnd',
      'rero'
    ],
    agentAgentTypes: {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    },
    agentLabelOrder: {
      de: [
        'gnd',
        'idref',
        'rero'
      ],
      fallback: 'fr',
      fr: [
        'idref',
        'rero',
        'gnd'
      ]
    },
    globalView: 'global',
    language: 'fr',
    operationLogs: {
      documents: 'doc',
      holdings: 'hold',
      items: 'item'
    },
    documentAdvancedSearch: false,
    userProfile: {
      readOnly: false,
      readOnlyFields: []
    }
  },
  street: 'Via Croix Noire 3',
  username: 'simonetta',
  permissions: testPermissions
};
