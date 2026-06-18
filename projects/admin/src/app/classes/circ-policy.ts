// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

import { ObjectReference } from '@rero/shared';

export type CircPolicy = {

  $schema: string;
  pid: string;
  description?: string;
  organisation: ObjectReference;
  checkout_duration?: number;
  allow_requests: boolean;
  pickup_hold_duration?: number;
  reminders?: {
    type: string,
    days_delay: number,
    fee_amount?: number,
    communication_channel: string,
    template: string
  }[];
  overdue_fees?: {
    intervals: {
      from: number,
      to?: number,
      fee_amount: number
    }[],
    maximum_total_amount?: number
  };
  number_renewals?: number;
  renewal_duration?: number;
  is_default: boolean;
  policy_library_level: boolean;
  libraries?: ObjectReference[];
  settings?: {
    patron_type: ObjectReference,
    item_type: ObjectReference,
  }[];
}
