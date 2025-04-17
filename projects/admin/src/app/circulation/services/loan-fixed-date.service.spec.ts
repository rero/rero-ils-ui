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
import { LoanFixedDateService } from "./loan-fixed-date.service";
import { LocalStorageService } from "@rero/ng-core";
import { of } from "rxjs";
import { LibraryService } from "@app/admin/menu/service/library.service";
import { MenuService } from "@app/admin/menu/service/menu.service";

describe('LoanFixedDateService', () => {
  let service: LoanFixedDateService;

  const libraryServiceSpy = jasmine.createSpyObj('LibraryService', ['']);
  libraryServiceSpy.switch$ = of({});

  const menuServiceSpy = jasmine.createSpyObj('MenuService', ['']);
  menuServiceSpy.logout$ = of({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LoanFixedDateService,
        LocalStorageService,
        { provide: LibraryService, useValue: libraryServiceSpy },
        { provide: MenuService, useValue: menuServiceSpy }
      ]
    });

    service = TestBed.inject(LoanFixedDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the date as a string', () => {
    expect(service.hasValue()).toBeFalse();

    const dateString = new Date().toISOString();
    service.set(dateString);
    expect(service.get()).toEqual(dateString);
  });

  it('should return undefined if the date has expired', () => {
    // minus 5 days
    const d = new Date();
    d.setDate(d.getDate() - 5);
    service.set(d.toISOString());
    expect(service.hasValue()).toBeTrue();
    expect(service.get()).toBeUndefined();
  });
});
