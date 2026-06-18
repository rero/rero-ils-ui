// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

export const loanPending = {
  metadata: {
    $schema: 'https://bib.rero.ch/schemas/loans/loan-ils-v0.0.1.json',
    document_pid: '201',
    item_pid: {
      type: 'item',
      value: '235'
    },
    library_pid: '1',
    location_pid: '3',
    organisation: {
      type: 'org',
      value: '1'
    },
    patron_pid: '3',
    patron_type_pid: '1',
    pickup_library_pid: '1',
    pickup_location_pid: '1',
    pid: '209',
    state: 'PENDING',
    to_anonymize: false,
    transaction_date: '2025-04-14T09:16:17.915316+00:00',
    transaction_library_pid: '1',
    transaction_location_pid: '1',
    transaction_user_pid: '1',
    trigger: 'request'
  }
}
