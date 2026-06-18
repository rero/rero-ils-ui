// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { PatronTransactionApiService } from './patron-transaction-api.service';


describe('PatronTranslationApiService', () => {
  let service: PatronTransactionApiService;

  const record = {
    medatadata: {
      pid: '1',
      name: 'transaction name'
    }
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
    links: {}
  };

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  recordServiceSpy.totalHits.mockReturnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot()],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(PatronTransactionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the fees', () => {
    service.getFees('1', 'open', 1)
      .subscribe((response: any) => expect(response).toEqual(apiResponse));
  });
});
