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

/* tslint:disable */
// required as json properties is not lowerCamelCase

import { ObjectReference } from '@rero/shared';

export interface CircPolicy {

  $schema: string;
  pid: string;
  description?: string;
  organisation: ObjectReference;
  checkout_duration?: number;
  allow_requests: boolean;
  pickup_hold_duration?: number;
  reminders?: Array<{
    type: string,
    days_delay: number,
    fee_amount?: number,
    communication_channel: string,
    template: string
  }>;
  overdue_fees?: {
    intervals: Array<{
      from: number,
      to?: number,
      fee_amount: number
    }>,
    maximum_total_amount?: number
  };
  number_renewals?: number;
  renewal_duration?: number;
  is_default: boolean;
  policy_library_level: boolean;
  libraries?: Array<ObjectReference>;
  settings?: Array<{
    patron_type: ObjectReference,
    item_type: ObjectReference,
  }>;
}
