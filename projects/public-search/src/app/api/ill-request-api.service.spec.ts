// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { IllRequestApiService } from './ill-request-api.service';

describe('IllRequestApiService', () => {
  let service: IllRequestApiService;
  const record = { medatadata: { pid: '1', name: 'item name' } };
  const apiResponse = {
    aggregations: {},
    hits: { total: { relation: 'eq', value: 1 }, hits: [record] },
    links: {}
  };
  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  recordServiceSpy.totalHits.mockReturnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(IllRequestApiService);
  });

  it('should be created', () => { expect(service).toBeTruthy(); });

  it('should return a set of Ill Requests', () => {
    service.getIllRequest('1', 1, 10).subscribe((result: any) => {
      expect(result.hits.hits[0]).toEqual(record);
    });
  });

  it('should return a set of Public Ill Requests', () => {
    service.getPublicIllRequest('1', 1, 10).subscribe((result: any) => {
      expect(result.hits.hits[0]).toEqual(record);
    });
  });
});
