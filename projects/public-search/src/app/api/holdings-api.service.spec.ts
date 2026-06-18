// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { EsRecord, EsResult, IAvailability } from '@rero/shared';
import { of } from 'rxjs';
import { QueryResponse } from '../record';
import { HoldingsApiService } from './holdings-api.service';
import { HoldingCanRequest, HoldingPatronRequest } from '../classes/holdings';


describe('HoldingsService', () => {

  let service: HoldingsApiService;

  const record: EsRecord = {
    created: "",
    id: "1",
    links: {
      self: ''
    },
    metadata: {
      pid: '1',
      name: 'holding name'
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

  const availability: IAvailability = {
    available: true
  }

  const canRequest = {
    holdingPid: '1',
    libraryPid: '1',
    patronBarcode: '1'
  };

  const holdingsPatronRequest = {
    holding_pid: '1',
    pickup_location_pid: '1',
    description: 'holdings patron request'
  };

  const httpClientSpy = { get: vi.fn(), post: vi.fn() };

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  recordServiceSpy.totalHits.mockReturnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
    providers: [
      { provide: RecordService, useValue: recordServiceSpy },
      { provide: HttpClient, useValue: httpClientSpy }
    ]
});
    service = TestBed.inject(HoldingsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a set of Holdings', () => {
    service.getHoldingsByDocumentPidAndViewcode('1', 'global')
      .subscribe((result: EsResult) => expect(result.hits.hits[0]).toEqual(record));
  });

  it('should return a set of Electronics Holdings', () => {
    service.getElectronicHoldingsByDocumentPidAndViewcode('1', 'global', 1)
      .subscribe((result: QueryResponse) => expect(result.hits[0]).toEqual(record));
  });

  it('should return to holdings if it can be requested', () => {
    httpClientSpy.get.mockReturnValue(of(canRequest));
    service.canRequest('1', '1', '1')
      .subscribe((result: HoldingCanRequest) => expect(result).toEqual(canRequest));
  });

  it('', () => {
    httpClientSpy.post.mockReturnValue(of(holdingsPatronRequest));
    service.request(holdingsPatronRequest)
      .subscribe((response: HoldingPatronRequest) => expect(response).toEqual(holdingsPatronRequest));
  });

  it('should return the availability of the holdings', () => {
    httpClientSpy.get.mockReturnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });
});
