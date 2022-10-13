/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { TranslateModule } from '@ngx-translate/core';
import { MenuItemInterface } from '@rero/ng-core';
import { testUserLibrarianWithSettings, User, UserService } from '@rero/shared';

import { MenuUserService } from './menu-user.service';

describe('MenuUserService', () => {
  let service: MenuUserService;

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  const user = new User(testUserLibrarianWithSettings);
  user.currentLibrary = '2';
  userServiceSpy.user = user;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    service = TestBed.inject(MenuUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the user menu', () => {
    service.generate();
    const menu = service.menu.getChildren();
    const menuIds = [
      'public-interface-menu',
      'logout-menu'
    ];
    menu[0].getChildren().map((menu: MenuItemInterface) =>
      expect(menuIds.includes(menu.getAttribute('id'))).toBeTrue());
  });
});
