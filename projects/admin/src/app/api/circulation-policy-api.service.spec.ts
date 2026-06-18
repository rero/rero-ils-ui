// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { CirculationPolicyApiService } from "./circulation-policy-api.service";

describe('CirculationPolicyApiService', () => {
  let service: CirculationPolicyApiService;

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [{
        metadata: {
          allow_requests: true,
          checkout_duration: 30,
          description: 'Default circulation policy'
        }
      }]
    },
    links: {}
  };

  const recordServiceSpy = { getRecords: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        CirculationPolicyApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(CirculationPolicyApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return circulation policies', () => {
    service.getAll().subscribe((result: any[]) => {
      expect(result).toHaveLength(1);
      expect('metadata' in result[0]).toBe(true);
    });
  });
});
