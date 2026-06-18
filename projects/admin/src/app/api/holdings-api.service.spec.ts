// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { of } from 'rxjs';

import { HoldingsApiService } from './holdings-api.service';
import { provideHttpClient } from '@angular/common/http';

describe('HoldingsApiService', () => {
  let service: HoldingsApiService;

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [{
        metadata: {
          pid: 1
        }
      }]
    },
    links: {}
  };

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(response));
  recordServiceSpy.totalHits.mockReturnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [
        TranslateModule.forRoot()],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: RecordUiService, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting(),
    ]
});
    service = TestBed.inject(HoldingsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the number of results', () => {
    service.getHoldingsCount('1', '1').subscribe((count: number) => {
      expect(count).toEqual(1);
    });
  });

  it('should return a result list', () => {
    service.getHoldings('1', '1').subscribe((hits: any[]) => {
      expect(hits.length).toEqual(1);
    });
  });
});
