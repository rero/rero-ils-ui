// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterStateSnapshot, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppStore, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { patchState } from '@ngrx/signals';
import { filter, firstValueFrom } from 'rxjs';
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

  const runGuard = (route: ActivatedRouteSnapshot): boolean =>
    TestBed.runInInjectionContext(() =>
      permissionGuard(route, {} as RouterStateSnapshot) as boolean
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes), TranslateModule.forRoot()],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });
    appStore = TestBed.inject(AppStore);
    router = TestBed.inject(Router);
  });

  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should allow access when one matching permission is present (OR)', () => {
    patchState(appStore as any, { permissions: [PERMISSIONS.DOC_SEARCH] });
    expect(runGuard(routeSnapshot)).toBe(true);
  });

  it('should deny access and redirect to 403 when no matching permission', async () => {
    patchState(appStore as any, { permissions: [PERMISSIONS.ITTY_SEARCH] });
    const navPromise = waitForNavigation();
    expect(runGuard(routeSnapshot)).toBe(false);
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });

  it('should deny access when route data has no permissions', async () => {
    patchState(appStore as any, { permissions: [PERMISSIONS.ILL_SEARCH] });
    const snapshot = structuredClone(routeSnapshot);
    snapshot.data = {};
    const navPromise = waitForNavigation();
    expect(runGuard(snapshot)).toBe(false);
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });

  it('should deny access when not all permissions are present (AND)', async () => {
    patchState(appStore as any, { permissions: [PERMISSIONS.DOC_CREATE, PERMISSIONS.HOLD_CREATE] });
    const snapshot = structuredClone(routeSnapshot);
    snapshot.data = { ...snapshot.data, operator: PERMISSION_OPERATOR.AND };
    const navPromise = waitForNavigation();
    expect(runGuard(snapshot)).toBe(false);
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });

  it('should allow access when all permissions are present (AND)', () => {
    patchState(appStore as any, { permissions: [PERMISSIONS.DOC_SEARCH, PERMISSIONS.DOC_CREATE, PERMISSIONS.ILL_SEARCH] });
    const snapshot = structuredClone(routeSnapshot);
    snapshot.data = { ...snapshot.data, operator: PERMISSION_OPERATOR.AND };
    expect(runGuard(snapshot)).toBe(true);
  });
});
