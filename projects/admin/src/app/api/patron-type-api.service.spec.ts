// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';

import { PatronTypeApiService } from './patron-type-api.service';

describe('PatronTypeApiService', () => {
  let service: PatronTypeApiService;

  const response = {
    aggregations: {},
    hits: {
      total: 1,
      hits: [
        {
          metadata: {
            pid: 1,
            name: 'Children',
            description: 'Children',
          },
        },
      ],
    },
    links: {},
  };

  const recordServiceSpy = { getRecords: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        PatronTypeApiService,
        { provide: RecordService, useValue: recordServiceSpy },
      ],
    });

    service = TestBed.inject(PatronTypeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of patron types', () => {
    service.getAll().subscribe((result: any[]) => expect(result).toEqual(response.hits.hits));
  });
});
