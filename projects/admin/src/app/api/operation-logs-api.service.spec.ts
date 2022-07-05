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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Record, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { OperationLogsApiService } from './operation-logs-api.service';


describe('OperationLogsService', () => {
  let service: OperationLogsApiService;

  const responseRecords = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        {
          date: '2021-01-26 09:30:00',
          operation: 'create',
          user_name: 'system'
        }
      ]
    },
    links: {}
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(responseRecords));
  recordServiceSpy.totalHits.and.returnValue(0);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy}
      ]
    });
    service = TestBed.inject(OperationLogsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of operations on a record', () => {
    service
      .getLogs('documents', '1', 'create', 1)
      .subscribe({
        next: (response: Record) => expect(response).toEqual(responseRecords)
    });
  });

  it('should return a list of circulation history on a item', () => {
    service
      .getCirculationLogs('documents', '1', 1)
      .subscribe({
        next: (response: Record) => expect(response).toEqual(responseRecords)
    });
  });
});
