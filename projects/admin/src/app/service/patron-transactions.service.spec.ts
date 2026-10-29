// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { apiResponse, patronTransaction } from '@rero/shared';
import { of } from 'rxjs';

import { PatronTransaction } from '../classes/patron-transaction';
import { PatronTransactionsService } from './patron-transactions.service';

describe('PatronTransactionsService', () => {
  let service: PatronTransactionsService;

  const response = { ...apiResponse };
  const recordServiceSpy = { getRecords: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PatronTransactionsService, { provide: RecordService, useValue: recordServiceSpy }],
    });

    service = TestBed.inject(PatronTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the patron transaction', () => {
    const transaction = { ...patronTransaction };
    response.hits.hits = [transaction];
    response.hits.total = response.hits.hits.length;
    recordServiceSpy.getRecords.mockReturnValue(of(response));

    service.getPatronTransaction('1').subscribe((result: any) => {
      expect(result).toBeInstanceOf(PatronTransaction);
      expect(result.type).toEqual('overdue');
    });
  });
});
