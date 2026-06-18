// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';

import { NotificationApiService } from './notification-api.service';
import { provideHttpClient } from '@angular/common/http';

describe('NotificationApiService', () => {
  let service: NotificationApiService;

  const notificationRecord = {
    "created": "2023-03-22T16:00:14.542814+00:00",
    "id": "34",
    "links": {
      "self": "https://localhost:5000/api/notifications/34"
    },
    "metadata": {
      "$schema": "https://bib.rero.ch/schemas/notifications/notification-v0.0.1.json",
      "context": {
        "loan": {
          "$ref": "https://bib.rero.ch/api/loans/69"
        }
      },
      "creation_date": "2023-03-22T16:00:14.527673+00:00",
      "notification_sent": true,
      "notification_type": "recall",
      "pid": "34",
      "process_date": "2023-03-22T16:00:14.714258",
      "status": "done"
    },
    "updated": "2023-03-22T16:00:14.719610+00:00"
  };

  const recordServiceSpy = { getRecord: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(notificationRecord));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
          { provide: RecordService, useValue: recordServiceSpy },
          provideHttpClient(),
          provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(NotificationApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a notification record', () => {
    service.getNotificationByPid('34').subscribe((record: any) => {
      expect(record).toEqual(notificationRecord.metadata);
    });
  });
});
