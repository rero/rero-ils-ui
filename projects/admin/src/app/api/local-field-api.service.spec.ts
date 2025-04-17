/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { RouterModule } from '@angular/router';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { of } from 'rxjs';
import { LocalFieldApiService } from './local-field-api.service';

describe('LocalFieldApiService', () => {

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
        RouterModule
      ],
      providers: [
        LocalFieldApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: RecordUiService, useValue: recordUiServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ]
    });
    localFieldApiService = TestBed.inject(LocalFieldApiService);
  });

  it('should create a service', () => {
    expect(localFieldApiService).toBeTruthy();
  });

  it('should return an empty object', () => {
    localFieldApiService.getByResourceTypeAndResourcePidAndOrganisationId('doc', '1', '1')
      .subscribe({
        next: (result) => expect('metadata' in result).toBeFalsy()
      });
  });

  it('should return true on the deletion of the record', () => {
    localFieldApiService.delete('1')
      .subscribe({
        next: (success: boolean) => expect(success).toBeTruthy()
      });
  });
});
