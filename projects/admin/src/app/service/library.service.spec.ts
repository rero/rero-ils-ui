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
import { LibraryService } from "./library.service";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { apiResponse } from "projects/shared/src/tests/api";

describe('LibraryService', () => {
  let service: LibraryService;

  const library = {
    metadata: {
      pid: '1',
      name: 'Library name'
    }
  };
  const response = {...apiResponse};
  response.hits.hits = [library];

  const recordServiceSpy = jasmine.createSpyObj('RecordServices', ['getRecords', 'getRecord', 'totalHits']);
  recordServiceSpy.getRecords.and.returnValue(of(response));
  recordServiceSpy.getRecord.and.returnValue(of(response.hits.hits[0]));
  recordServiceSpy.totalHits.and.returnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LibraryService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(LibraryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should return the number of libraries', () => {
    service.count$.subscribe((result: number) => expect(result).toEqual(1));
  });

  it('should return a library', () => {
    service.get$('1').subscribe((result: any) => expect(result).toEqual(library))
  });

  it('should return the sorted libraries', () => {
    service.findAllOrderBy$().subscribe((result: any) => expect(result).toEqual(response));
  });

  it('should return libraries matching the pid and sorted by', () => {
    service.findByLibrariesPidAndOrderBy$(['1'])
    .subscribe((result: any) => expect(result).toEqual(response));
  });
});
