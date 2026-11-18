// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';

import { NotificationType } from '../../../classes/notification';
import { LibraryFormService } from './library-form.service';

describe('LibraryFormService', () => {
  let service: LibraryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [LibraryFormService] });
    service = TestBed.inject(LibraryFormService);
    service.notificationTypes = [NotificationType.AVAILABILITY];
    service.build();
  });

  it('should save a delay of 0 when only the availability email is filled in', () => {
    service.notification_settings.at(0).get('email').setValue('notif@example.com');

    expect(service.getValues().notification_settings).toEqual([
      { type: NotificationType.AVAILABILITY, email: 'notif@example.com', delay: 0 },
    ]);
  });
});
