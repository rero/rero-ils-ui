/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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

/** admin Roles for a patron */
export const testPatronLibrarianRoles = ['librarian', 'system_librarian'];

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
    baseUrl: 'https://ils.rero.ch',
    constributionSources: [
      'idref',
      'gnd',
      'rero'
    ],
    contributionAgentTypes: {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    },
    contributionsLabelOrder: {
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
    librarianRoles: ['librarian', 'system_librarian']
  },
  street: 'Via Croix Noire 3',
  username: 'simonetta'
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
  ]
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
    baseUrl: 'https://ils.rero.ch',
    constributionSources: [
      'idref',
      'gnd',
      'rero'
    ],
    contributionAgentTypes: {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    },
    contributionsLabelOrder: {
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
    librarianRoles: ['librarian', 'system_librarian']
  },
  street: 'Via Croix Noire 3',
  username: 'simonetta'
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
    baseUrl: 'https://ils.rero.ch',
    constributionSources: [
      'idref',
      'gnd',
      'rero'
    ],
    contributionAgentTypes: {
      'bf:Person': 'persons',
      'bf:Organisation': 'corporate-bodies'
    },
    contributionsLabelOrder: {
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
    librarianRoles: ['librarian']
  },
  street: 'Via Croix Noire 3',
  username: 'simonetta'
};
