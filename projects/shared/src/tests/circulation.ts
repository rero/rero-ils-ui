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

export const circulationPolicy = {
  metadata: {
    $schema: 'https://bib.rero.ch/schemas/circ_policies/circ_policy-v0.0.1.json',
    allow_requests: true,
    automatic_renewal: true,
    checkout_duration: 30,
    description: 'Default circulation policy',
    is_default: true,
    name: 'Default',
    number_renewals: 3,
    organisation: {
      pid: '1',
      type: 'org'
    },
    overdue_fees: {
      intervals: [
        {
          fee_amount: 0.1,
          from: 1,
          to: 20
        },
        {
          fee_amount: 0.2,
          from: 21,
          to: 100
        }
      ]
    },
    pickup_hold_duration: 10,
    pid: '1',
    policy_library_level: false,
    reminders: [
      {
        communication_channel: 'patron_setting',
        days_delay: 5,
        template: 'email/due_soon',
        type: 'due_soon'
      },
      {
        communication_channel: 'patron_setting',
        days_delay: 5,
        template: 'email/overdue',
        type: 'overdue'
      }
    ],
    renewal_duration: 30
  }
};

export const patronTransaction = {
  metadata: {
    $schema: '"https://bib.rero.ch/schemas/patron_transactions/patron_transaction-v0.0.1.json',
    creation_date: '2025-03-31T06:30:35.415610+00:00',
    document: {
      pid: '2000103',
      type: 'doc'
    },
    item: {
      pid: '342',
      type: 'item'
    },
    library: {
      pid: '3',
      type: 'lib'
    },
    loan: {
      pid: '64',
      type: 'loanid'
    },
    note: 'Frais de retard incrémentaux',
    organisation: {
      pid: '1',
      type: 'org'
    },
    patron: {
      barcode: '2050124311',
      pid: '4',
      type: 'ptrn'
    },
    pid: '26',
    status: 'open',
    total_amount: 0.4,
    type: 'overdue'
  }
}

export const testItem = {
  available: false,
  barcode: 'I11111',
  call_number: "CN 11223",
  document: {
    pid: '1'
  },
  status: 'on_shelf',
  organisation: {
    pid: '1'
  },
  pid: '1',
  requests_count: 0,
  currentAction: 'checkout',
  loan: {
    pid: '1',
    state: 'created',
    dueDate: '2025-04-22',
    expired: false
  },
  actions: [],
  number_of_extensions: 0,
  pending_loans: [],
  location: {
    pid: '1'
  },
  library: {
    pid: '1'
  },
  library_location_name: 'Library location name',
  acquisition_date: '2025-04-22',
  enumerationAndChronology: "I-12",
  _currentAction: 'checkout',
  actionDone: 'checkout',
  notes: []
};

export const testItemWithAllSerializedData = {
  "metadata": {
    "item": {
      "$schema": "https://bib.rero.ch/schemas/items/item-v0.0.1.json",
      "actions": [
        "checkin",
        "extend_loan"
      ],
      "barcode": "10000000406",
      "call_number": "00406",
      "current_pending_requests": 0,
      "document": {
        "pid": "2000044",
        "title": [
          {
            "_text": "Europ\u00e4ische Hochschulschriften : Publications universitaires europ\u00e9ennes. S\u00e9rie 2, Sciences juridiques. Reihe 2, Rechtswissenschaft = European university papers. Series 2, Law",
            "mainTitle": [
              {
                "value": "Europ\u00e4ische Hochschulschriften"
              }
            ],
            "part": [
              {
                "partName": [
                  {
                    "value": "Reihe 2, Rechtswissenschaft"
                  }
                ]
              }
            ],
            "subtitle": [
              {
                "value": "Publications universitaires europ\u00e9ennes. S\u00e9rie 2, Sciences juridiques"
              }
            ],
            "type": "bf:Title"
          },
          {
            "mainTitle": [
              {
                "value": "European university papers. Series 2, Law"
              }
            ],
            "type": "bf:ParallelTitle"
          },
          {
            "mainTitle": [
              {
                "value": "European university papers"
              }
            ],
            "part": [
              {
                "partName": [
                  {
                    "value": "Series 2, Law"
                  }
                ]
              }
            ],
            "type": "bf:VariantTitle"
          },
          {
            "mainTitle": [
              {
                "value": "European university studies"
              }
            ],
            "part": [
              {
                "partName": [
                  {
                    "value": "Series 2, Law"
                  }
                ]
              }
            ],
            "type": "bf:VariantTitle"
          },
          {
            "mainTitle": [
              {
                "value": "Publications universitaires europ\u00e9ennes"
              }
            ],
            "part": [
              {
                "partName": [
                  {
                    "value": "S\u00e9rie 2, Sciences juridiques"
                  }
                ]
              }
            ],
            "type": "bf:VariantTitle"
          },
          {
            "mainTitle": [
              {
                "value": "Publications universitaires europ\u00e9ennes"
              }
            ],
            "part": [
              {
                "partName": [
                  {
                    "value": "S\u00e9rie 2, Droit"
                  }
                ]
              }
            ],
            "type": "bf:VariantTitle"
          }
        ],
        "type": "doc"
      },
      "holding": {
        "pid": "394",
        "type": "hold"
      },
      "item_type": {
        "pid": "1",
        "type": "itty"
      },
      "legacy_checkout_count": 11,
      "library": {
        "pid": "3",
        "type": "lib"
      },
      "library_location_name": "Biblioth\u00e8que communale et scolaire d'Avise: Section multim\u00e9dia",
      "location": {
        "name": "Section multim\u00e9dia",
        "organisation": {
          "pid": "1"
        },
        "pid": "10",
        "type": "loc"
      },
      "notes": [
        {
          "content": "Checkout note for 10000000406",
          "type": "checkout_note"
        },
        {
          "content": "Missing some pages :-(",
          "type": "condition_note"
        },
        {
          "content": "Checkin note for 10000000406",
          "type": "checkin_note"
        },
        {
          "content": "Here you can read a general/public note",
          "type": "general_note"
        },
        {
          "content": "Link with an other item (same subject) : <a href=\"javascript:void()\">dummy_link</a>",
          "type": "binding_note"
        },
        {
          "content": "Part of the UNESCO books collection",
          "type": "patrimonial_note"
        },
        {
          "content": "Antique library collection",
          "type": "provenance_note"
        },
        {
          "content": "Acquisition note content",
          "type": "acquisition_note"
        },
        {
          "content": "This is a staff note only visible by staff members.",
          "type": "staff_note"
        }
      ],
      "organisation": {
        "pid": "1",
        "type": "org"
      },
      "pac_code": "2_controlled_consumption",
      "pid": "406",
      "price": 92,
      "status": "on_loan",
      "type": "standard"
    },
    "loan": {
      "$schema": "https://bib.rero.ch/schemas/loans/loan-ils-v0.0.1.json",
      "checkout_location_pid": "5",
      "creation_date": "Thu, 20 Feb 2025 08:21:17 GMT",
      "document_pid": "2000044",
      "due_soon_date": "2025-04-25T00:00:00+00:00",
      "end_date": "2025-04-30T21:58:59.877736+00:00",
      "extension_count": 1,
      "item_pid": {
        "type": "item",
        "value": "406"
      },
      "last_end_date": "2025-04-30T21:58:59.877736+00:00",
      "organisation": {
        "$ref": "https://bib.rero.ch/api/organisations/1"
      },
      "patron": {
        "barcode": "2050124311",
        "name": "Casalini, Simonetta"
      },
      "patron_pid": "4",
      "pickup_location": {
        "library_name": "Biblioth\u00e8que cantonale vald\u00f4taine, site de Pont-saint-Martin",
        "name": "Espaces publics",
        "pickup_name": "AOSTE CANT2: Espaces publics"
      },
      "pickup_location_pid": "5",
      "pid": "72",
      "start_date": "2025-02-20T08:21:17.191551+00:00",
      "state": "ITEM_ON_LOAN",
      "to_anonymize": false,
      "transaction_date": "2025-03-31T06:25:19.107760+00:00",
      "transaction_location_pid": "10",
      "transaction_user_pid": "4",
      "trigger": "extend"
    }
  }
};

export const testCirculationInformations = {
  "fees": {
    "engaged": 13.000000029802322,
    "preview": 25.7
  },
  "messages": [],
  "statistics": {
    "CANCELLED": 1,
    "ITEM_AT_DESK": 1,
    "ITEM_IN_TRANSIT_TO_HOUSE": 1,
    "ITEM_ON_LOAN": 11,
    "ITEM_RETURNED": 1,
    "PENDING": 2,
    "ill_requests": 2
  }
};

export const testOverduePreview = {
  "fees": {
    "steps": [
      [
        0.1,
        "2025-03-24T00:00:00+01:00"
      ],
      [
        0.1,
        "2025-03-27T00:00:00+01:00"
      ],
      [
        0.1,
        "2025-03-30T00:00:00+01:00"
      ],
      [
        0.1,
        "2025-03-31T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-03T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-06T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-07T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-10T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-13T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-14T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-17T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-20T00:00:00+02:00"
      ],
      [
        0.1,
        "2025-04-21T00:00:00+02:00"
      ]
    ],
    "total": 1.3
  },
  "loan": {
    "$schema": "https://bib.rero.ch/schemas/loans/loan-ils-v0.0.1.json",
    "checkout_location_pid": "13",
    "document_pid": "2000110",
    "due_soon_date": "2025-03-18T00:00:00+00:00",
    "end_date": "2025-03-23T22:58:59.958642+00:00",
    "item_pid": {
      "type": "item",
      "value": "334"
    },
    "last_end_date": "2025-03-23T22:58:59.958642+00:00",
    "organisation": {
      "$ref": "https://bib.rero.ch/api/organisations/1"
    },
    "patron_pid": "4",
    "pickup_location_pid": "13",
    "pid": "61",
    "start_date": "2025-02-20T08:21:09.753609+00:00",
    "state": "ITEM_ON_LOAN",
    "to_anonymize": false,
    "transaction_date": "2025-02-20T08:21:09.753609+00:00",
    "transaction_location_pid": "13",
    "transaction_user_pid": "2",
    "trigger": "checkout"
  }
};
