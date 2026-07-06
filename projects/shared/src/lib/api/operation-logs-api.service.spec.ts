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
  let recordServiceSpy: any;

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

  beforeEach(() => {
    recordServiceSpy = {
      getRecords: vi.fn().mockReturnValue(of(responseRecords)),
      totalHits: vi.fn().mockReturnValue(0)
    };
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
      .getLogs('documents', '1', 1)
      .subscribe({
        next: (response: any) => expect(response).toEqual(responseRecords)
    });
  });

  it('should return resource operation logs sorted by most recent', () => {
    service
      .getLogs('documents', '1', 1)
      .subscribe({
        next: (response: any) => expect(response).toEqual(responseRecords)
    });

    expect(recordServiceSpy.getRecords).toHaveBeenCalledWith('operation_logs', {
      query: 'record.type:documents AND record.value:1',
      page: 1,
      itemsPerPage: 10,
      headers: OperationLogsApiService.reroJsonheaders,
      sort: 'mostrecent'
    });
  });

  it('should return resource operation logs with a custom sort', () => {
    service
      .getLogs('documents', '1', 2, 20, 'created')
      .subscribe({
        next: (response: any) => expect(response).toEqual(responseRecords)
    });

    expect(recordServiceSpy.getRecords).toHaveBeenCalledWith('operation_logs', {
      query: 'record.type:documents AND record.value:1',
      page: 2,
      itemsPerPage: 20,
      headers: OperationLogsApiService.reroJsonheaders,
      sort: 'created'
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
