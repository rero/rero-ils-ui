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
import { TranslateModule } from '@ngx-translate/core';
import { RecordModule, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';

import { HoldingsApiService } from './holdings-api.service';

describe('HoldingsApiService', () => {
  let service: HoldingsApiService;

  const response = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 1
      },
      hits: [{
        metadata: {
          pid: 1
        }
      }]
    },
    links: {}
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(response));
  recordServiceSpy.totalHits.and.returnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RecordModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
      ]
    });
    service = TestBed.inject(HoldingsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the number of results', () => {
    service.getHoldingsCount('1', '1').subscribe((count: number) => {
      expect(count).toEqual(1);
    });
  });

  it('should return a result list', () => {
    service.getHoldings('1', '1').subscribe((hits: any[]) => {
      expect(hits.length).toEqual(1);
    });
  });
});
