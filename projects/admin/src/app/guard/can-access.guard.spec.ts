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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { firstValueFrom, filter } from 'rxjs';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { RecordPermissionService } from '../service/record-permission.service';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from './can-access.guard';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('canAccessGuard', () => {
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
          "loans": 1 }
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


  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.params = { type: 'items', pid: '1' };

  const runGuard = (route: any) =>
    TestBed.runInInjectionContext(() =>
      canAccessGuard(route, {} as RouterStateSnapshot)
    ) as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        TranslateModule.forRoot()
      ],
      providers: [
          provideHttpClient(withInterceptorsFromDi()),
          provideHttpClientTesting()
      ]
    });
    router = TestBed.inject(Router);
    recordPermissionService = TestBed.inject(RecordPermissionService);
  });

  /** Helper to wait until router finishes navigating */
  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should be created', () => {
    expect(canAccessGuard).toBeTruthy();
  });

  it('should return a 400 error if any parameters are missing', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = {};
    activatedRoute.params = {};
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  it('should return a 400 error if route parameters are missing', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = {};
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  it('should return a 400 error if data parameters are missing', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = {};
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  it('should return a 400 error if the action parameter is not in the action list', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: 'foo' };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  it('should return a 400 error if any parameter of the route is not in the mandatory parameters.', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = { foo: 'bar' };
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  it('should return a 403 error, if the permission is not allowed', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const perms = cloneDeep(permissions);
    vi.spyOn(recordPermissionService, 'getPermission').mockReturnValue(of(perms));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });

  it('should return true, if permission is granted', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const perms = cloneDeep(permissions);
    perms.read.can = true;
    vi.spyOn(recordPermissionService, 'getPermission').mockReturnValue(of(perms));
    const access = await firstValueFrom(runGuard(activatedRoute));
    expect(access).toBe(true);
  });

  it('should return a 403 error, if the permission on the update action is not allowed', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.UPDATE };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    vi.spyOn(recordPermissionService, 'getPermission').mockReturnValue(of(permissions));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });
});
