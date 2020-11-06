/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { RouterTestingModule } from '@angular/router/testing';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { of } from 'rxjs';
import { LocalFieldApiService } from './local-field-api.service';

describe('Service: LocalFieldApi', () => {

  let localFieldApiService: LocalFieldApiService;

  const emptyRecords = {
    aggregations: {},
    hits: {
      total: {
        relation: 'eq',
        value: 0
      },
      hits: []
    },
    links: {}
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(emptyRecords));
  recordServiceSpy.totalHits.and.returnValue(0);

  const recordUiServiceSpy = jasmine.createSpyObj('RecordUiService', ['deleteRecord']);
  recordUiServiceSpy.deleteRecord.and.returnValue(of(true));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        LocalFieldApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: RecordUiService, useValue: recordUiServiceSpy },
      ]
    });
    localFieldApiService = TestBed.inject(LocalFieldApiService);
  });

  it('should create a service', () => {
    expect(localFieldApiService).toBeTruthy();
  });

  it('should return an empty object', () => {
    localFieldApiService
      .getByResourceTypeAndResourcePidAndOrganisationId('doc', '1', '1')
      .subscribe(result => {
        expect('metadata' in result).toBeFalsy();
      });
  });

  it('should return true on the deletion of the record', () => {
    localFieldApiService
      .delete('1').subscribe((success: boolean) => {
        expect(success).toBeTruthy();
      });
  });
});
