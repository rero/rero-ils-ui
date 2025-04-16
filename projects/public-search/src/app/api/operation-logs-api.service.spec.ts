/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Record, RecordModule, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { OperationLogsApiService } from './operation-logs-api.service';


describe('OperationLogsApiService', () => {
  let service: OperationLogsApiService;

  const apiResponse = {
    aggregations: [],
    hits: [],
    links: []
};
  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords']);
  recordServiceSpy.getRecords.and.returnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RecordModule
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
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
      .subscribe((result: Record) => expect(result).toEqual(apiResponse))
  });
});
