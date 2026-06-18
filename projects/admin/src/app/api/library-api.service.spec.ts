// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { RecordService } from "@rero/ng-core";
import { of } from "rxjs";
import { LibraryApiService } from "./library-api.service";

describe('LibraryApiService', () => {
  let service: LibraryApiService;

  const library = {
    metadata: {
      code: 'FOO-BAR',
      name: 'FOO BAR',
      pid: 1
    }
  };
  const recordServiceSpy = { getRecord: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(library));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LibraryApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting(),
      ] });

    service = TestBed.inject(LibraryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a library', () => {
    service.getByPid('1').subscribe((result: any) => expect(result).toEqual(library.metadata));
  });
});
