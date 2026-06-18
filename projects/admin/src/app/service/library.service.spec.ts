// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from "@angular/core/testing";
import { LibraryService } from "./library.service";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { apiResponse } from "@rero/shared";

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

  const recordServiceSpy = { getRecords: vi.fn(), getRecord: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecords.mockReturnValue(of(response));
  recordServiceSpy.getRecord.mockReturnValue(of(response.hits.hits[0]));
  recordServiceSpy.totalHits.mockReturnValue(1);

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
