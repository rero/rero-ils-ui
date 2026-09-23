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
      total: 1,
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

  describe('getCirculationTransactionsByUser()', () => {
    it('should return the transactions for the given user', () => {
      service
        .getCirculationTransactionsByUser('patron-1', 1)
        .subscribe({
          next: (response: any) => expect(response).toEqual(responseRecords)
      });
    });

    it('should query both loan and scan_item records for the transaction user', () => {
      service
        .getCirculationTransactionsByUser('patron-1', 1)
        .subscribe();

      expect(recordServiceSpy.getRecords).toHaveBeenCalledWith('operation_logs', {
        query: '(record.type:loan AND loan.transaction_user.pid:patron-1) OR (record.type:scan_item AND user.value:patron-1)',
        page: 1,
        itemsPerPage: 10,
        headers: OperationLogsApiService.reroJsonheaders,
        sort: 'operation_date_mostrecent'
      });
    });

    it('should use the given page and itemsPerPage', () => {
      service
        .getCirculationTransactionsByUser('patron-1', 2, 20)
        .subscribe();

      expect(recordServiceSpy.getRecords).toHaveBeenCalledWith('operation_logs', {
        query: '(record.type:loan AND loan.transaction_user.pid:patron-1) OR (record.type:scan_item AND user.value:patron-1)',
        page: 2,
        itemsPerPage: 20,
        headers: OperationLogsApiService.reroJsonheaders,
        sort: 'operation_date_mostrecent'
      });
    });

    it('should default itemsPerPage to 10', () => {
      service
        .getCirculationTransactionsByUser('patron-1', 1)
        .subscribe();

      expect(recordServiceSpy.getRecords).toHaveBeenCalledWith('operation_logs', expect.objectContaining({
        itemsPerPage: 10
      }));
    });
  });
});
