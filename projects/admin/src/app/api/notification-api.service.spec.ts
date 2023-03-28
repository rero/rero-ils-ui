/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';

import { NotificationApiService } from './notification-api.service';

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

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord']);
  recordServiceSpy.getRecord.and.returnValue(of(notificationRecord));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy }
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
