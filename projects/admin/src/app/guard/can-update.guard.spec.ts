/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { RecordPermissionService } from '../service/record-permission.service';
import { CanUpdateGuard } from './can-update.guard';
import { cloneDeep } from 'lodash-es';
import { Router } from '@angular/router';

describe('CanUpdateGuard', () => {
  let guard: CanUpdateGuard;
  let recordPermissionService: RecordPermissionService;
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const permissions = {
    create: {
      can: true
    },
    list: {
      can: true
    },
    update: {
      can: true
    }
  };

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.params = { type: 'item_types', pid: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
    });
    guard = TestBed.inject(CanUpdateGuard);
    recordPermissionService = TestBed.inject(RecordPermissionService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the permission for update is valid', () => {
    spyOn(recordPermissionService, 'getPermission').and.returnValue(of(permissions));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe((access: boolean) => {
      expect(access).toBeTruthy();
    });
  });

  it('should return a 403 error if the type is not correct', fakeAsync(() => {
    const updatePermissions = cloneDeep(permissions);
    updatePermissions.update.can = false;
    spyOn(recordPermissionService, 'getPermission').and.returnValue(of(updatePermissions));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));
});
