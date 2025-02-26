/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { TestBed } from '@angular/core/testing';

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LibrarySwitchService } from '@app/admin/menu/service/library-switch.service';
import { MenuService } from '@app/admin/menu/service/menu.service';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, LocalStorageService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { LoanFixedDateService } from './loan-fixed-date.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LoanFixedDateService', () => {
  let service: LoanFixedDateService;
  let librarySwitchService: LibrarySwitchService;

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    currentLibrary: 1,
    patronLibrarian: {
      libraries: [
        { pid: '1', organisation: '1' },
        { pid: '2', organisation: '1' }
      ]
    }
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [TranslateModule.forRoot(),
        CoreModule],
    providers: [
        LibrarySwitchService,
        LocalStorageService,
        MenuService,
        { provide: UserService, useValue: userServiceSpy },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(LoanFixedDateService);
    librarySwitchService = TestBed.inject(LibrarySwitchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return undefined, if the stored date is less than the current date', () => {
    const date = new Date();
    date.setTime(date.getTime() - 600000000);
    const dateString = date.toLocaleDateString('en');
    service.set(dateString);
    expect(service.get()).toBeUndefined();
  });

  it('should delete the stored value', () => {
    const date = new Date();
    service.set(date.toLocaleDateString('en'));
    expect(service.hasValue()).toBeTrue();
    service.remove();
    expect(service.hasValue()).toBeFalse();
    expect(service).toBeTruthy();
  });

  it('should delete the value in the localeStorage if the library changes', () => {
    // Set default library to 2
    librarySwitchService.switch('2');
    // Set a new date with offset
    const date = new Date();
    date.setTime(date.getTime() + 600000000);
    const dateString = date.toLocaleDateString('en');
    service.set(dateString);
    expect(service.get()).toEqual(dateString);
    librarySwitchService.switch('1');
    expect(service.get()).toBeUndefined();
  });
});
