/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { testUserPatronMultipleOrganisationsWithSettings, UserApiService, UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { IMenu, PatronProfileMenuService } from './patron-profile-menu.service';

describe('Service: PatronProfileMenu', () => {
  let service: PatronProfileMenuService;
  let patronProfileMenuService: PatronProfileMenuService;
  let userService: UserService;

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  const menu = [
    {
      value: '1',
      name: 'Organisation 1'
    },
    {
      value: '10',
      name: 'Organisation 2'
    }
];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PatronProfileMenuService,
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    });
    service = TestBed.inject(PatronProfileMenuService);
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronMultipleOrganisationsWithSettings)));
    patronProfileMenuService = TestBed.inject(PatronProfileMenuService);
    patronProfileMenuService.init();
    userService = TestBed.inject(UserService);
    userService.load();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the service parameters', () => {
    expect(service.menu).toEqual(menu);
    expect(service.currentMenu).toEqual(menu[0]);
    const currentPatron = testUserPatronMultipleOrganisationsWithSettings.patrons[0];
    expect(service.currentPatron).toEqual(currentPatron);
    expect(service.isMultiOrganisation).toBeTruthy();
  });

  it('should return the service parameters after a change', () => {
    const currentPatron = testUserPatronMultipleOrganisationsWithSettings.patrons[1];
    service.change(currentPatron.pid);
    expect(service.currentMenu).toEqual(menu[1]);
    expect(service.currentPatron).toEqual(currentPatron);
  });

  it('should return the selected menu item', () => {
    service.onChange$.subscribe((menuChange: IMenu) => {
      expect(menuChange).toEqual(menu[1]);
    });
    const currentPatron = testUserPatronMultipleOrganisationsWithSettings.patrons[1];
    service.change(currentPatron.pid);
  });
});
