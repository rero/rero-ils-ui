/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { IAvailability } from '@rero/shared';
import { of } from 'rxjs';
import { QueryResponse } from '../record';
import { HoldingsApiService } from './holdings-api.service';


describe('HoldingsService', () => {

  let service: HoldingsApiService;

  const record = {
    medatadata: {
      pid: '1',
      name: 'holding name'
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

  const availability: IAvailability = {
    available: true
  }

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
  recordServiceSpy.totalHits.and.returnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(HoldingsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a set of Holdings', () => {
    service.getHoldingsByDocumentPidAndViewcode('1', 'global', 1).subscribe((result: QueryResponse) => {
      expect(result.hits[0]).toEqual(record);
    });
  });

  it('should return the availability of the holdings', () => {
    httpClientSpy.get.and.returnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });
});
