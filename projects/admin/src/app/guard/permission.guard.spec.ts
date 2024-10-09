/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { PERMISSION_OPERATOR, PERMISSIONS, PermissionsService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { ErrorPageComponent } from 'projects/admin/src/app/error/error-page/error-page.component';

import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
  let guard: PermissionGuard;
  let permissionsService: PermissionsService;
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.data = { permissions: [ PERMISSIONS.DOC_SEARCH, PERMISSIONS.DOC_CREATE, PERMISSIONS.ILL_SEARCH ] };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot(),
        HttpClientTestingModule
      ]
    });
    guard = TestBed.inject(PermissionGuard);
    permissionsService = TestBed.inject(PermissionsService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('Should allow access', () => {
    permissionsService.setPermissions([ PERMISSIONS.DOC_SEARCH ]);
    guard.canActivate(activatedRouteSnapshotSpy).subscribe((access: any) => {
      expect(access).toBeTrue();
    });
  });

  it('Should not allow access if missing permissions in route data', fakeAsync(() => {
    permissionsService.setPermissions([ PERMISSIONS.ILL_SEARCH ]);
    const routeSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    routeSnapshot.data = {};
    guard.canActivate(routeSnapshot).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('Should not allow access', fakeAsync(() => {
    permissionsService.setPermissions([ PERMISSIONS.ITTY_SEARCH ]);
    guard.canActivate(activatedRouteSnapshotSpy).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('Should not allow access if the 2 permissions are not present (and operator)', fakeAsync(() => {
    permissionsService.setPermissions([ PERMISSIONS.DOC_CREATE, PERMISSIONS.HOLD_CREATE ]);
    const routeSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    routeSnapshot.data['operator'] = PERMISSION_OPERATOR.AND;
    guard.canActivate(routeSnapshot).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('Should allow access if the 3 permissions are present (and operator)', () => {
    permissionsService.setPermissions([ PERMISSIONS.DOC_SEARCH, PERMISSIONS.DOC_CREATE, PERMISSIONS.ILL_SEARCH ]);
    const routeSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    routeSnapshot.data['operator'] = PERMISSION_OPERATOR.AND;
    guard.canActivate(routeSnapshot).subscribe((access: boolean) => {
      expect(access).toBeTrue();
    });
  });
});
