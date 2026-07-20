// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, RouterModule, UrlTree } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppState, AppStore, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { patchState, WritableStateSource } from '@ngrx/signals';
import { ErrorPageComponent } from '@app/admin/error/error-page/error-page.component';
import { permissionGuard } from './permission.guard';

describe('permissionGuard', () => {
  let appStore: InstanceType<typeof AppStore>;
  let router: Router;

  const routes = [
    { path: 'errors/403', component: ErrorPageComponent }
  ];

  const routeSnapshot = {
    data: { permissions: [PERMISSIONS.DOC_SEARCH, PERMISSIONS.DOC_CREATE, PERMISSIONS.ILL_SEARCH] }
  } as any as ActivatedRouteSnapshot;

  const runGuard = (route: ActivatedRouteSnapshot) =>
    TestBed.runInInjectionContext(() =>
      permissionGuard(route, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    appStore = TestBed.inject(AppStore);
    router = TestBed.inject(Router);
  });

  it('should allow access when one matching permission is present (OR)', () => {
    patchState(appStore as unknown as WritableStateSource<AppState>, { permissions: [PERMISSIONS.DOC_SEARCH] });
    expect(runGuard(routeSnapshot)).toBe(true);
  });

  it('should deny access and redirect to 403 when no matching permission', () => {
    patchState(appStore as unknown as WritableStateSource<AppState>, { permissions: [PERMISSIONS.ITTY_SEARCH] });
    const result = runGuard(routeSnapshot);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
  });

  it('should deny access when route data has no permissions', () => {
    patchState(appStore as unknown as WritableStateSource<AppState>, { permissions: [PERMISSIONS.ILL_SEARCH] });
    const snapshot = structuredClone(routeSnapshot);
    snapshot.data = {};
    const result = runGuard(snapshot);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
  });

  it('should deny access when not all permissions are present (AND)', () => {
    patchState(appStore as unknown as WritableStateSource<AppState>, { permissions: [PERMISSIONS.DOC_CREATE, PERMISSIONS.HOLD_CREATE] });
    const snapshot = structuredClone(routeSnapshot);
    snapshot.data = { ...snapshot.data, operator: PERMISSION_OPERATOR.AND };
    const result = runGuard(snapshot);
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
  });

  it('should allow access when all permissions are present (AND)', () => {
    patchState(appStore as unknown as WritableStateSource<AppState>, { permissions: [PERMISSIONS.DOC_SEARCH, PERMISSIONS.DOC_CREATE, PERMISSIONS.ILL_SEARCH] });
    const snapshot = structuredClone(routeSnapshot);
    snapshot.data = { ...snapshot.data, operator: PERMISSION_OPERATOR.AND };
    expect(runGuard(snapshot)).toBe(true);
  });
});
