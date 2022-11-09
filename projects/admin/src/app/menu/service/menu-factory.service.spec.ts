/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
 * Copyright (C) 2022 UCLouvain
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PERMISSIONS, PermissionsService, PERMISSION_OPERATOR, UserService } from '@rero/shared';
import { IMenuParent } from '../menu-definition/menu-interface';
import { cloneDeep } from 'lodash-es';

import { MenuFactoryService } from './menu-factory.service';

describe('MenuFactoryService', () => {
  let service: MenuFactoryService;
  let permissionsService: PermissionsService;
  let translateService: TranslateService;

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);
  userServiceSpy.user = {
    symbolName: 'AN',
    currentLibrary: 4,
    currentOrganisation: 2
  };

  const MENU: IMenuParent[] = [
    {
      name: 'User',
      attributes: { id: 'user-services-menu' },
      extras: { iconClass: 'fa fa-users' },
      children: [
        {
          name: 'Account',
          attributes: { id: 'account-menu' },
          extras: { iconClass: 'fa fa-exchange' },
          children: [
            {
              name: 'My data',
              router_link: ['/', 'account', 'data'],
              attributes: { id: 'account-data-menu' },
              extras: { iconClass: 'fa fa-briefcase' }
            },
            {
              name: 'Change password',
              router_link: ['/', 'account', 'password'],
              attributes: { id: 'account-password' },
              extras: { iconClass: 'fa fa-briefcase' },
              access: {
                permissions: [PERMISSIONS.PERM_MANAGEMENT]
              }
            }
          ],
          access: {
            permissions: [PERMISSIONS.CIRC_ADMIN]
          }
        },
        {
          name: 'Contact',
          router_link: ['/', 'account', 'contact', '$currentOrganisation'],
          attributes: { id: 'contact' },
          extras: { iconClass: 'fa fa-briefcase' },
          translate: false
        }
      ]
    },
    {
      name: 'Acquisition',
      attributes: { id: 'acquisition-menu' },
      children: [
        {
          name: 'Vendors',
          router_link: ['/', 'vendors'],
          query_params: {
            library: '$currentLibrary',
            organisation: '$currentOrganisation'
          },
          attributes: { id: 'vendors-menu' },
          extras: { iconClass: 'fa fa-briefcase' },
          access: {
            permissions: [
              PERMISSIONS.ACAC_ACCESS,
              PERMISSIONS.ACAC_CREATE
            ],
            operator: PERMISSION_OPERATOR.AND
          }
        }
      ]
    },
    {
      name: 'Hide menu',
      attributes: { id: 'hide-menu' },
      children: []
    },
    {
      name: '$symbolName',
      attributes: { id: 'user-menu' },
      children: [
        {
          name: 'Public interface',
          uri: '/',
          attributes: {
            id: 'my-account-menu',
            class: 'dropdown-menu dropdown-menu-right'
          }
        },
        {
          name: 'Logout',
          uri: '/logout',
          attributes: {
            id: 'logout-menu'
          }
        }
      ]
    },
  ];

  const userPermissions = [
    PERMISSIONS.CIRC_ADMIN,
    PERMISSIONS.ACAC_ACCESS,
    PERMISSIONS.ACAC_CREATE
  ];

  const userPermissions2 = [
    PERMISSIONS.CIRC_ADMIN,
    PERMISSIONS.ACAC_ACCESS
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        PermissionsService,
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    service = TestBed.inject(MenuFactoryService);
    permissionsService = TestBed.inject(PermissionsService);
    translateService = TestBed.inject(TranslateService);
    translateService.setTranslation('fr', {
      Account: 'Compte',
      'Change password': 'Changer le mot de passe',
      Contact: 'Contactez-moi',
      'My data': 'Mes données',
      User: 'Utilisateur',
      Vendors: 'Fournisseurs'
    });
    translateService.setDefaultLang('fr');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the menu', () => {
    permissionsService.setPermissions(userPermissions);
    const menu = service.create('app menu', MENU);

    const children = menu.getChildren();
    expect(children.length).toEqual(3);

    expect(children[0].getName()).toEqual('Utilisateur');
    expect(children[0].getAttribute('id')).toEqual('user-services-menu');
    expect(children[0].getExtra('iconClass')).toEqual('fa fa-users');

    const firstChildren = children[0].getChildren();
    expect(firstChildren.length).toEqual(2);
    expect(firstChildren[0].getName()).toEqual('Compte');

    // Name not translated
    expect(firstChildren[1].getName()).toEqual('Contact');
    expect(firstChildren[1].getRouterLink()).toEqual(['/', 'account', 'contact', '2'])

    const secondChildren = children[1].getChildren();
    expect(secondChildren[0].getQueryParam('library')).toEqual('4');
    expect(secondChildren[0].getQueryParam('organisation')).toEqual('2');

    const thirdChildren = children[2].getChildren();
    expect(thirdChildren.length).toEqual(2);
    expect(children[2].getName()).toEqual(userServiceSpy.user.symbolName);

    expect(thirdChildren[0].getUri()).toEqual('/');
    expect(thirdChildren[1].getUri()).toEqual('/logout');
  });

  it('should return the menu (check permissions AND)', () => {
    permissionsService.setPermissions(userPermissions2);
    const menu = service.create('app menu', MENU);
    const children = menu.getChildren();
    expect(children.length).toEqual(2);
  });

  it('should return an error if the defined variable is not available', () => {
    permissionsService.setPermissions(userPermissions2);
    const menu = cloneDeep(MENU);
    menu[3].name = '$foo'
    expect(function() { service.create('app menu', menu) })
      .toThrowError(EvalError, 'Name exception: This variable "$foo" is not available.');
  });
});
