// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

// required as json properties is not lowerCamelCase

import { ObjectReference } from '../../../../shared/src/lib/classes/core';
import { DateTime } from 'luxon';

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
  creation_date: DateTime;
  process_date?: DateTime;
  notification_sent = false;
  notification_type: NotificationType;
  context: {
    loan?: ObjectReference,
    reminder_counter?: number,
    order?: ObjectReference,
    recipients?: {
      type: string;
      address: string;
    }[]
  };

  constructor(obj?: any) {
    Object.assign(this, obj);
  }


}
