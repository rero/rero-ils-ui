// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { OperationLogsApiService } from './operation-logs-api.service';
import { provideHttpClient } from '@angular/common/http';


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

  const recordServiceSpy = {
    getRecords: vi.fn().mockReturnValue(of(responseRecords)),
    totalHits: vi.fn().mockReturnValue(0)
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
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
        next: (response: any) => expect(response).toEqual(responseRecords)
    });
  });

  it('should return a list of circulation history on a item', () => {
    service
      .getCirculationLogs('documents', '1', 1)
      .subscribe({
        next: (response: any) => expect(response).toEqual(responseRecords)
    });
  });
});
