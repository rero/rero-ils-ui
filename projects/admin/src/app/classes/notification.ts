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

export enum NotificationState {
  AVAILABILITY = 'availability',
  BOOKING = 'booking',
  DUE_SOON = 'due_soon',
  OVERDUE = 'overdue',
  RECALL = 'recall',
  REQUEST = 'request',
  TRANSIT_NOTICE = 'transit_notice'
}

export class Notification {
  static readonly types = {
    patron: [
      NotificationState.AVAILABILITY,
      NotificationState.DUE_SOON,
      NotificationState.OVERDUE,
      NotificationState.RECALL
    ],
    library: [
      NotificationState.BOOKING,
      NotificationState.REQUEST,
      NotificationState.TRANSIT_NOTICE
    ]
  };
}
