// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { NotificationType } from '../../../../classes/notification';
import { NotificationTypePipe } from './notificationType.pipe';

describe('NotificationPipe', () => {
  it('create an instance', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe).toBeTruthy();
  });

  it('should return true if key is available on patron type', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe.transform(NotificationType.AVAILABILITY, 'patron')).toBeTruthy();
  });

  it('should return true if key is available on library type', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe.transform(NotificationType.BOOKING, 'library')).toBeTruthy();
  });

  it('should return false if key is not available on type', () => {
    const pipe = new NotificationTypePipe();
    expect(pipe.transform(NotificationType.AVAILABILITY, 'library')).toBeFalsy();
  });
});
