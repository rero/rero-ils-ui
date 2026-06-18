// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { LibraryApiService } from "./library-api.service";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { apiResponse } from "@rero/shared";

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
  const recordServiceSpy = { getRecords: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LibraryApiService,
        { provide: RecordService, useValue: recordServiceSpy }
      ]
    });

    service = TestBed.inject(LibraryApiService);
    apiResponse.hits.hits = [library];
    recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the library api response', () => {
    service.findByLibrariesPidAndOrderBy$(['1'])
      .subscribe((result: any) => expect(result).toEqual(apiResponse));
  });

});
