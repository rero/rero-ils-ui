// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RecordService } from "@rero/ng-core";
import { apiResponse } from "@rero/shared";
import { of } from "rxjs";
import { accountDefaultData, IAcqAccount } from "../classes/account";
import { AcqBudget } from "../classes/budget";
import { AcqAccountApiService } from "./acq-account-api.service";
import { AcqBudgetApiService } from "./acq-budget-api.service";

describe('AcqBudgetApiService', () => {
  let service: AcqBudgetApiService;

  const budgetRecord = {
    $schema: '/schema',
    pid: '1',
    name: 'Budget 1',
    start_date: '2025-01-01',
    end_date: '2025-12-31',
    is_active: true,
    organisation: {
      pid: '1'
    }
  }

  const accountRecord: IAcqAccount = {
      name: "AOSTE-CANT1-Collections",
      number: "AOSTE-CANT1.Col.01.000",
      depth: 0,
      is_active: false,
      allocated_amount: 50200,
      encumbrance_amount: {
        children: 341,
        self: 0,
        total: 341
      },
      expenditure_amount: {
        children: 75,
        self: 0,
        total: 75
      },
      distribution: 40000,
      budget: {
        pid: '1'
      },
      parent: undefined,
      organisation: {
        pid: '1',
        type: 'org'
      }
    };

    const accountRecord2: IAcqAccount = {
      name: "AOSTE-CANT1-Collections 2",
      number: "AOSTE-CANT1.Col.02.000",
      depth: 0,
      is_active: false,
      allocated_amount: 12400,
      encumbrance_amount: {
        children: 12,
        self: 0,
        total: 12
      },
      expenditure_amount: {
        children: 45,
        self: 0,
        total: 45
      },
      distribution: 2000,
      budget: {
        pid: '1'
      },
      parent: undefined,
      organisation: {
        pid: '1',
        type: 'org'
      }
    };

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.totalHits.mockReturnValue(2);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcqBudgetApiService,
        AcqAccountApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    service = TestBed.inject(AcqBudgetApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a budget list', () => {
    apiResponse.hits.hits = [{metadata: budgetRecord}]
    recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
    service.getBudgets().subscribe((result: any[]) => {
      expect(result[0]).toBeInstanceOf(AcqBudget);
      expect(result[0].name).toEqual('Budget 1');
    });
  });

  it('should return the total budget amount', () => {
    apiResponse.hits.hits = [
      {metadata: {...accountDefaultData, ...accountRecord}},
      {metadata: {...accountDefaultData, ...accountRecord2}}
    ];
    recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
    service.getBudgetTotalAmount('1').subscribe((result: number) => expect(result).toEqual(62600));
  });
});
