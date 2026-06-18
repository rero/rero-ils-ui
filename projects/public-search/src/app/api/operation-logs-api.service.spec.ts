// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { OperationLogsApiService } from './operation-logs-api.service';


describe('OperationLogsApiService', () => {
  let service: OperationLogsApiService;

  const apiResponse = {
    aggregations: [],
    hits: [],
    links: []
};
  const recordServiceSpy = { getRecords: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(OperationLogsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getHistory', () => {
    service.getHistory('1', 1)
      .subscribe((result: any) => expect(result).toEqual(apiResponse))
  });
});
