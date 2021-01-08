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
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { HoldingsService } from './holdings.service';
import { ItemService } from './item.service';


describe('ItemService', () => {
  let service: ItemService;

  const record = {
    medatadata: {
      pid: '1',
      name: 'item name'
    }
  };

  const emptyRecords = {
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

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(emptyRecords));
  recordServiceSpy.totalHits.and.returnValue(1);

  const holdingsPids = ['100', '120'];
  const holdingsServiceSpy = jasmine.createSpyObj('HoldingsService', ['getHoldingsPidsByDocumentPidAndViewcode']);
  holdingsServiceSpy.getHoldingsPidsByDocumentPidAndViewcode.and.returnValue(of(holdingsPids));

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  httpClientSpy.get.and.returnValue(of(canRequest));
  httpClientSpy.post.and.returnValue(of(request));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: HoldingsService, useValue: holdingsServiceSpy }
      ]
    });
    service = TestBed.inject(ItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a count of Items', () => {
    service.getItemsTotalByHoldingsPidAndViewcode('1', 'global').subscribe(count => {
      expect(count).toEqual(1);
    });
  });

  it('should return a set of Items by holdings pid', () => {
    service.getItemsByHoldingsPidAndViewcode('1', 'global', 1).subscribe(result => {
      expect(result[0]).toEqual(record);
    });
  });

  it('should return a count of Items', () => {
    service.getItemsTotalByDocumentPidAndViewcode('1', 'global').subscribe(count => {
      expect(count).toEqual(1);
    });
  });

  it('should return a set of Items by document pid', () => {
    service.getItemsByDocumentPidAndViewcode('1', 'global', 1).subscribe((result: any) => {
      expect(result.hits.hits[0]).toEqual(record);
    });
  });

  it('should return item can request', () => {
    service.canRequest('1', 'xxxxxxxx').subscribe((result: any) => {
      expect(result).toEqual(canRequest);
    });
  });

  it('should return a result of request', () => {
    service.request({}).subscribe((result: any) => {
      expect(result).toEqual(request);
    });
  });
});
