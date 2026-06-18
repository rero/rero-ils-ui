// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { LocationService } from "./location.service";
import { of } from "rxjs";
import { apiResponse } from "@rero/shared";
import { RecordService } from "@rero/ng-core";
import { location } from "@rero/shared";

describe('LocationService', () => {
  let service: LocationService;

  const response = {...apiResponse};

  const recordServiceSpy = { getRecords: vi.fn(), totalHits: vi.fn() };

  recordServiceSpy.totalHits.mockReturnValue(1);

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
    recordServiceSpy.getRecords.mockReturnValue(of(response));
    service.getLocationsByLibraries$(['1'])
      .subscribe((result: any) => expect(result).toEqual([location]));
  });
});
