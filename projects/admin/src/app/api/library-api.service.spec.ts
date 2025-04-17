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

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
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
  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord']);
  recordServiceSpy.getRecord.and.returnValue(of(library));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LibraryApiService,
        { provide: RecordService, useValue: recordServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(LibraryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a library', () => {
    service.getByPid('1').subscribe((result: any) => expect(result).toEqual(library.metadata));
  });
});
