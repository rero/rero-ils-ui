/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, version 3 of the License.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { TranslateModule } from "@ngx-translate/core";
import { RecordModule, RecordService } from "@rero/ng-core";
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

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords']);
  recordServiceSpy.getRecords.and.returnValue(of(response));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RecordModule
      ],
      providers: [
        CirculationPolicyApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
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
      expect(result).toHaveSize(1);
      expect('metadata' in result[0]).toBeTrue();
    });
  });
});
