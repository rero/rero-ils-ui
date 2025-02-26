/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Record, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { IllRequestApiService } from './ill-request-api.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('IllRequestApiService', () => {
  let service: IllRequestApiService;
  const record = {
    medatadata: {
      pid: '1',
      name: 'item name'
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

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
  recordServiceSpy.totalHits.and.returnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(IllRequestApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a set of Ill Requests', () => {
    service.getIllRequest('1', 1, 10).subscribe((result: Record) => {
      expect(result.hits.hits[0]).toEqual(record);
    });
  });
});
