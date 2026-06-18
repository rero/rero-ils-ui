// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';
import { Notification, NotificationType } from '../../../../classes/notification';

@Pipe({ name: 'notificationType' })
export class NotificationTypePipe implements PipeTransform {

  private readonly _notification = Notification.types;

  transform(notification: NotificationType, type: keyof typeof Notification.types): boolean {
    return Object.keys(this._notification).includes(type)
      && this._notification[type].includes(notification);
  }
}
