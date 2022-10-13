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
import { TestBed } from '@angular/core/testing';
import { cloneDeep } from 'lodash-es';
import { PERMISSIONS, PERMISSION_OPERATOR } from '../util/permissions';

import { PermissionsService } from './permissions.service';

const userPermissions = [
  PERMISSIONS.UI_ACCESS,
  PERMISSIONS.CIPO_CREATE,
  PERMISSIONS.CIPO_SEARCH,
  PERMISSIONS.DOC_CREATE,
  PERMISSIONS.DOC_SEARCH,
];

describe('PermissionService', () => {
  let service: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsService);
    service
      .setPermissions(userPermissions);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return the access according to the permission(s), operator OR', () => {
    expect(service.canAccess(PERMISSIONS.VNDR_CREATE)).toBeFalse();
    expect(service.canAccess(PERMISSIONS.DOC_CREATE)).toBeTrue();
    expect(service.canAccess([PERMISSIONS.VNDR_CREATE, PERMISSIONS.VNDR_SEARCH])).toBeFalse();
    expect(service.canAccess([PERMISSIONS.CIPO_CREATE, PERMISSIONS.DOC_CREATE])).toBeTrue();
  });

  it('should return the access according to the permission(s), operator AND', () => {
    expect(service.canAccess([PERMISSIONS.CIPO_CREATE, PERMISSIONS.CIPO_SEARCH], PERMISSION_OPERATOR.AND)).toBeTrue();
    expect(service.canAccess([PERMISSIONS.ITEM_CREATE, PERMISSIONS.DOC_CREATE], PERMISSION_OPERATOR.AND)).toBeFalse();
  });

  it('should return an exception if the operator is not correct', () => {
    expect(function() { service.canAccess([PERMISSIONS.CIPO_CREATE, PERMISSIONS.CIPO_SEARCH], 'xor')})
      .toThrowError();
  });

  it('should return access to the debug mode', () => {
    expect(service.canAccessDebugMode()).toBeFalse();
    const perms = cloneDeep(userPermissions);
    perms.push(PERMISSIONS.DEBUG_MODE);
    service.setPermissions(perms);
    expect(service.canAccessDebugMode()).toBeTrue();
  });
});
