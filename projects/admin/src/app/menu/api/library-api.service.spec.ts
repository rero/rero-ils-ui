/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { TestBed } from "@angular/core/testing";
import { LibraryApiService } from "./library-api.service";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { apiResponse } from "projects/shared/src/tests/api";

describe('LibraryApiService', () => {
  let service: LibraryApiService;

  const library = [
    {
      metadata: {
        pid: '1',
        name: 'Library name'
      }
    }
  ];
  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords']);
  recordServiceSpy.getRecords.and.returnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LibraryApiService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(LibraryApiService);
    apiResponse.hits.hits = [library];
    recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the library api response', () => {
    service.findByLibrariesPidAndOrderBy$(['1'])
      .subscribe((result: any) => expect(result).toEqual(apiResponse));
  });

});
