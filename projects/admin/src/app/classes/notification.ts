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

/* tslint:disable */
// required as json properties is not lowerCamelCase

import { Moment } from 'moment';
import { ObjectReference } from '../../../../shared/src/lib/class/core';

export enum NotificationType {
  AT_DESK = 'at_desk',
  AVAILABILITY = 'availability',
  BOOKING = 'booking',
  DUE_SOON = 'due_soon',
  OVERDUE = 'overdue',
  RECALL = 'recall',
  REQUEST = 'request',
  TRANSIT_NOTICE = 'transit_notice',
  ACQUISITION_ORDER = 'acquisition_order',
  CLAIM_ISSUE = 'claim_issue',
  AUTO_EXTEND = 'auto_extend'
}

export class Notification {
  static readonly types = {
    patron: [
      NotificationType.AVAILABILITY,
      NotificationType.DUE_SOON,
      NotificationType.OVERDUE,
      NotificationType.RECALL,
      NotificationType.AUTO_EXTEND
    ],
    library: [
      NotificationType.AT_DESK,
      NotificationType.BOOKING,
      NotificationType.REQUEST,
      NotificationType.TRANSIT_NOTICE
    ]
  };

  pid: string;
  creation_date: Moment;
  process_date?: Moment;
  notification_sent = false;
  notification_type: NotificationType;
  context: {
    loan?: ObjectReference,
    reminder_counter?: number,
    order?: ObjectReference,
    recipients?: Array<{
      type: string;
      address: string;
    }>
  };

  constructor(obj?: any) {
    Object.assign(this, obj);
  }


}
