// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { PatronTransactionApiService } from "./patron-transaction-api.service";
import { HttpClient } from "@angular/common/http";
import { ApiService, RecordService } from "@rero/ng-core";
import { TranslateModule } from "@ngx-translate/core";
import { FeeFormModel } from "../circulation/patron/patron-transactions/patron-fee/patron-fee.component";
import { of } from "rxjs";

describe('PatronTransactionApiService', () => {
  let service: PatronTransactionApiService;

  const fee: FeeFormModel = {
    type: {
      label: "fee",
      value: "",
      data: ""
    },
    total_amount: 10,
    creation_date: '2025-04-16 12:00:00',
    patron: {
      $ref: ""
    },
    library: {
      $ref: ""
    },
    organisation: {
      $ref: ""
    },
    status: "",
    event: {
      operator: {
        $ref: ""
      },
      library: {
        $ref: ""
      }
    }
  };

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [{
        metadata: {
          creation_date: '2025-03-31T06:30:35.415610+00:00',
          pid: 1,
          status: 'open',
          total_amount: 0.4
        }
      }]
    },
    links: {}
  };

  const httpClientSpy = { post: vi.fn() };

  const recordServiceSpy = { getRecords: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        PatronTransactionApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ApiService, useValue: { getEndpointByType: vi.fn().mockReturnValue('/api/patron_transactions/') } }
      ]
    });

    service = TestBed.inject(PatronTransactionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the fee object', () => {
    httpClientSpy.post.mockReturnValue(of(fee));
    service.addFee(fee).subscribe((result: object) => expect(result).toEqual(fee))
  });

  it('should return a list of fees on an item', () => {
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    service.getActiveFeesByItemPid('1')
      .subscribe((result: any) => expect(result).toEqual(response.hits.hits))
  });
});
