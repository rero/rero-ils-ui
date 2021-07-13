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
import { RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { PatronTransactionApiService } from './patron-transaction-api.service';


describe('PatronTranslationApiService', () => {
  let service: PatronTransactionApiService;

  const record = {
    medatadata: {
      pid: '1',
      name: 'transaction name'
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
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });
    service = TestBed.inject(PatronTransactionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load the fees', () => {
    service.getFees('1', 'open', 1).subscribe((response: any) => {
      expect(response).toEqual(apiResponse);
    });
  });
});
