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
import { PERMISSIONS, PermissionsService, testUserLibrarianWithSettings, User, UserService } from '@rero/shared';
import { LibrarySwitchService } from './library-switch.service';
import { MenuUserServicesService } from './menu-user-services.service';

describe('MenuUserServicesService', () => {
  let service: MenuUserServicesService;
  let librarySwitchService: LibrarySwitchService;
  let permissionsService: PermissionsService;

  const partialPermissions = [
    PERMISSIONS.CIRC_ADMIN,
    PERMISSIONS.ILL_ACCESS,
    PERMISSIONS.VNDR_ACCESS,
    PERMISSIONS.ITEM_ACCESS,
    PERMISSIONS.CIPO_ACCESS,
    PERMISSIONS.ITTY_ACCESS,
  ];

  // Function to check menu
  const menuCheck = (menu: MenuItemInterface, menuIds: string[]) => {
    menu.getChildren().map((menu: MenuItemInterface) =>
      expect(menuIds.includes(menu.getAttribute('id'))).toBeTrue());
  }

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
        { provide: UserService, useValue: userServiceSpy },
        PermissionsService
      ]
    });
    service = TestBed.inject(MenuUserServicesService);
    librarySwitchService = TestBed.inject(LibrarySwitchService);
    permissionsService = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

 it('Should return the user menu (without permissions)', () => {
    service.generate();
    const menus = service.menu.getChildren();
    // Without permissions, we only see the catalog menu
    expect(menus.length === 1).toBeTrue();
    expect(menus.some((menu: MenuItemInterface) =>
      menu.getAttribute('id') === 'user-services-menu')).toBeFalse();
  });

  it('Should return the user menu (with partial permissions)', () => {
    permissionsService.setPermissions(partialPermissions);
    service.generate();
    const menus = service.menu.getChildren();
    // Display of all menus
    expect(menus.length === 5).toBeTrue();
    let menuIds = [
      'user-services-menu',
      'catalog-menu',
      'acquisitions-menu',
      'report-monitoring-menu',
      'admin-and-monitoring-menu'
    ];
    menus.map((menu: MenuItemInterface) => expect(menuIds.includes(menu.getAttribute('id'))).toBeTrue());
    // User menu
    menuCheck(menus[0], ['circulation-menu', 'requests-menu', 'ill-requests-menu', 'current-loans-menu']);
    // Catalog menu
    menuCheck(menus[1], ['persons-menu', 'corporate-bodies-menu']);
    // Acquisition menu
    menuCheck(menus[2], ['vendors-menu']);
    // Report menu
    menuCheck(menus[3], ['inventory-list-menu']);
    // Admin menu
    menuCheck(menus[4], ['circulation-policies-menu', 'item-types-menu']);
  });
});
