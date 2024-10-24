/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { userTestingService } from 'projects/admin/tests/utils';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { RecordPermissionService } from '../service/record-permission.service';
import { CAN_ACCESS_ACTIONS, CanAccessGuard } from './can-access.guard';


describe('CanAccessGuard', () => {
  let guard: CanAccessGuard;
  let router: Router;
  let recordPermissionService: RecordPermissionService;

  const routes = [
    {
      path: 'errors/400',
      component: ErrorPageComponent
    },
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const permissions = {
    "create": {
      "can": false
    },
    "delete": {
      "can": false,
      "reasons": {
        "links": {
          "loans": 1,
        }
      }
    },
    "list": {
      "can": false
    },
    "read": {
      "can": false
    },
    "update": {
      "can": false
    }
  }


  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.params = { type: 'items', pid: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userTestingService }
      ]
    });
    guard = TestBed.inject(CanAccessGuard);
    router = TestBed.inject(Router);
    recordPermissionService = TestBed.inject(RecordPermissionService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return a 400 error if any parameters are missing', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = {};
    activatedRoute.params = {};
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return a 400 error if route parameters are missing', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = {};
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return a 400 error if data parameters are missing', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = {};
    activatedRoute.params = { type: 'patrons', pid: 1 };
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return a 400 error if the action parameter is not in the action list', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: 'foo' };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return a 400 error if any parameter of the route is not in the mandatory parameters.', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };;
    activatedRoute.params = { foo: 'bar' };
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return a 403 error, if the permission is not allowed', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const perms = cloneDeep(permissions);
    spyOn(recordPermissionService, 'getPermission').and.returnValue(of(perms));
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('should return true, if permission is granted', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const perms = cloneDeep(permissions);
    perms.read.can = true;
    spyOn(recordPermissionService, 'getPermission').and.returnValue(of(perms));
    guard.canActivate(activatedRoute).subscribe((access: boolean) => {
      expect(access).toBeTrue();
    });
  }));

  it('should return a 403 error, if the permission on the update action is not allowed', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.UPDATE };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    spyOn(recordPermissionService, 'getPermission').and.returnValue(of(permissions));
    guard.canActivate(activatedRoute).subscribe((access: boolean) => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));
});
