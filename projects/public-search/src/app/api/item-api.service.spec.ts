// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { EsRecord, EsResult, IAvailability } from '@rero/shared';
import { of } from 'rxjs';
import { ItemApiService } from './item-api.service';


describe('ItemService', () => {
  let service: ItemApiService;

  const record: EsRecord = {
    created: "",
    id: "1",
    links: {
      self: ''
    },
    metadata: {
      pid: '1',
      name: 'item name'
    },
    updated: ""
  };

  const apiResponse = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [
        record
      ]
    },
    links: {
      self: ''
    }
  };

  const canRequest = {
    can: true,
    reasons: {}
  };

  const request = {
    request: {},
    metadata: {}
  };

  const availability: IAvailability = {
    available: true,
    status: 'on_loan'
  }

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  recordServiceSpy.totalHits.mockReturnValue(1);

  const httpClientSpy = { get: vi.fn(), post: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy }
    ]
});
    service = TestBed.inject(ItemApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a set of Items by holdings pid', () => {
    const holdings = {
      metadata: {
        pid: '1',
        holdings_type: 'regular'
      }
    };
    service.getItemsByHoldingsAndViewcode(holdings, 'global', 1).subscribe((result: EsResult) => {
      expect(result).toEqual(apiResponse);
    });
  });

  it('should return item can request', () => {
    httpClientSpy.get.mockReturnValue(of(canRequest));
    service.canRequest('1', '1', 'xxxxxxxx').subscribe((result: any) => {
      expect(result).toEqual(canRequest);
    });
  });

  it('should return a result of request', () => {
    httpClientSpy.post.mockReturnValue(of(request));
    service.request({ item_pid: '1', pickup_location_pid: '1' }).subscribe((result: any) => {
      expect(result).toEqual(request);
    });
  });

  it('should return the availability of the item', () => {
    httpClientSpy.get.mockReturnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });
});
