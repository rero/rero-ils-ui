// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { accountDefaultData, IAcqAccount } from "../classes/account";
import { AcqAccountApiService } from "./acq-account-api.service";

describe('AcqAccountApiService', () => {
  let service: AcqAccountApiService;

  const record: IAcqAccount = {
    name: "AOSTE-CANT1-Collections",
    number: "AOSTE-CANT1.Col.01.000",
    depth: 0,
    is_active: false,
    allocated_amount: 50000,
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

  const record2: IAcqAccount = {
    name: "AOSTE-CANT1-Collections 2",
    number: "AOSTE-CANT1.Col.02.000",
    depth: 0,
    is_active: false,
    allocated_amount: 10000,
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

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        { metadata: record },
        { metadata: record2 }
      ]
    },
    links: {}
  };

  const httpClientSpy = { get: vi.fn() };
  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn(), delete: vi.fn() };
  recordServiceSpy.totalHits.mockReturnValue(2);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcqAccountApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(AcqAccountApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return an acquisition account with default value', () => {
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    const data = {...accountDefaultData, ...record};
    service.getAccount('1').subscribe((result: any) => expect(result).toEqual(data))
  });

  it('should return a list of acquisition accounts', () => {
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    const data = [
      {...accountDefaultData, ...record},
      {...accountDefaultData, ...record2},
    ];
    service.getAccounts('1').subscribe((result: any) => expect(result).toEqual(data));
  });

  it('should transfer an amount between 2 accounts', () => {
    httpClientSpy.get.mockReturnValue(of({}));
    service.transferFunds('1', '2', 10000).subscribe((result: any) => expect(result).toEqual({}));
  });
});
