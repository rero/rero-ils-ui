// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { PatronTransactionsService } from "./patron-transactions.service";
import { of } from "rxjs";
import { apiResponse } from "@rero/shared";
import { patronTransaction } from "@rero/shared";
import { RecordService } from "@rero/ng-core";
import { PatronTransaction } from "../classes/patron-transaction";

describe('PatronTransactionsService', () => {
  let service: PatronTransactionsService;

  const response = {...apiResponse};
  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.totalHits.mockReturnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatronTransactionsService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(PatronTransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the patron transaction', () => {
    const transaction = {...patronTransaction};
    response.hits.hits = [transaction];
    recordServiceSpy.getRecords.mockReturnValue(of(response));

    service.getPatronTransaction('1').subscribe((result: any) => {
      expect(result).toBeInstanceOf(PatronTransaction);
      expect(result.type).toEqual('overdue');
    });
  });
});
