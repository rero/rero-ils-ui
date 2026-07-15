// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { cloneDeep } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { RecordPermissionService } from '../service/record-permission.service';
import { CAN_ACCESS_ACTIONS, canAccessGuard } from './can-access.guard';
import { provideHttpClient } from '@angular/common/http';


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
          provideHttpClient(),
          provideHttpClientTesting()
      ]
    });
    router = TestBed.inject(Router);
    recordPermissionService = TestBed.inject(RecordPermissionService);
  });

  it('should be created', () => {
    expect(canAccessGuard).toBeTruthy();
  });

  it('should return a 400 UrlTree if any parameters are missing', () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = {};
    activatedRoute.params = {};
    const result = runGuard(activatedRoute);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/400');
  });

  it('should return a 400 UrlTree if route parameters are missing', () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = {};
    const result = runGuard(activatedRoute);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/400');
  });

  it('should return a 400 UrlTree if data parameters are missing', () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = {};
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const result = runGuard(activatedRoute);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/400');
  });

  it('should return a 400 UrlTree if the action parameter is not in the action list', () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: 'foo' };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const result = runGuard(activatedRoute);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/400');
  });

  it('should return a 400 UrlTree if any parameter of the route is not in the mandatory parameters.', () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = { foo: 'bar' };
    const result = runGuard(activatedRoute);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/400');
  });

  it('should return a 403 UrlTree, if the permission is not allowed', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.READ };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    const perms = cloneDeep(permissions);
    vi.spyOn(recordPermissionService, 'getPermission').mockReturnValue(of(perms));
    const result = await firstValueFrom(runGuard(activatedRoute));
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
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

  it('should return a 403 UrlTree, if the permission on the update action is not allowed', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { action: CAN_ACCESS_ACTIONS.UPDATE };
    activatedRoute.params = { type: 'patrons', pid: 1 };
    vi.spyOn(recordPermissionService, 'getPermission').mockReturnValue(of(permissions));
    const result = await firstValueFrom(runGuard(activatedRoute));
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
  });
});
