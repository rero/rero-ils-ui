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
import { ItemApiService } from './item-api.service';


describe('ItemService', () => {
  let service: ItemApiService;

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

  const canRequest = {
    can: true,
    reasons: []
  };

  const request = {
    request: {},
    metadata: {}
  };

  const availability: IAvailability = {
    available: true,
    status: 'on_loan'
  }

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
  recordServiceSpy.totalHits.and.returnValue(1);

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);

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
    service = TestBed.inject(ItemApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a set of Items by holdings pid', () => {
    const holdings = {
      metadata: {
        pid: '1',
        holdings_type: 'regular'
      }
    };
    service.getItemsByHoldingsAndViewcode(holdings, 'global', 1).subscribe((result: QueryResponse) => {
      expect(result.hits[0]).toEqual(record);
    });
  });

  it('should return item can request', () => {
    httpClientSpy.get.and.returnValue(of(canRequest));
    service.canRequest('1', '1', 'xxxxxxxx').subscribe((result: any) => {
      expect(result).toEqual(canRequest);
    });
  });

  it('should return a result of request', () => {
    httpClientSpy.post.and.returnValue(of(request));
    service.request({ item_pid: '1', pickup_location_pid: '1' }).subscribe((result: any) => {
      expect(result).toEqual(request);
    });
  });

  it('should return the availability of the item', () => {
    httpClientSpy.get.and.returnValue(of(availability));
    service.getAvailability('1')
      .subscribe((response: IAvailability) => expect(response).toEqual(availability));
  });
});
