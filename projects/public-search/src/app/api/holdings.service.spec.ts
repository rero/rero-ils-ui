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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HoldingsService } from './holdings.service';
import { RecordService } from '@rero/ng-core';
import { HttpClient } from '@angular/common/http';


describe('HoldingsService', () => {

  let service: HoldingsService;

  const record = {
    medatadata: {
      pid: '1',
      name: 'holding name'
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

  const holdingsPids = ['100', '120'];

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(emptyRecords));
  recordServiceSpy.totalHits.and.returnValue(1);

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
  httpClientSpy.get.and.returnValue(of(holdingsPids));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: HttpClient, useValue: httpClientSpy }
      ]
    });
    service = TestBed.inject(HoldingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a count of Holdings', () => {
    service.getHoldingsTotalByDocumentPidAndViewcode('1', 'global').subscribe(count => {
      expect(count).toEqual(1);
    });
  });

  it('should return a set of Holdings', () => {
    service.getHoldingsByDocumentPidAndViewcode('1', 'global', 1).subscribe(result => {
      expect(result[0]).toEqual(record);
    });
  });

  it('should return a set of Holdings Pids', () => {
    service.getHoldingsPidsByDocumentPidAndViewcode('1', 'global').subscribe(result => {
      expect(result).toEqual(holdingsPids);
    });
  });
});
