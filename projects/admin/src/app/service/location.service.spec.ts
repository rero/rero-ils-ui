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
import { LocationService } from "./location.service";
import { of } from "rxjs";
import { apiResponse } from "projects/shared/src/tests/api";
import { RecordService } from "@rero/ng-core";
import { location } from "@rero/shared";

describe('LocationService', () => {
  let service: LocationService;

  const response = {...apiResponse};

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecords', 'totalHits']);

  recordServiceSpy.totalHits.and.returnValue(1);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(LocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of locations in relation to libraries', () => {
    response.hits.hits = [{...location}];
    recordServiceSpy.getRecords.and.returnValue(of(response));
    service.getLocationsByLibraries$(['1'])
      .subscribe((result: any) => expect(result).toEqual([location]));
  });
});
