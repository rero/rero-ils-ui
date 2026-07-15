// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AppConfigService } from '../app-config.service';
import { ErrorPageComponent } from '../error/error-page.component';
import { collectionAccessGuard } from './collection-access.guard';

const makeRoute = (viewcode: string | undefined, parentViewcode?: string): ActivatedRouteSnapshot =>
  ({
    params: viewcode !== undefined ? { viewcode } : {},
    parent: parentViewcode !== undefined ? { params: { viewcode: parentViewcode } } : null,
  }) as unknown as ActivatedRouteSnapshot;

describe('collectionAccessGuard', () => {
  let router: Router;
  let appConfigService: AppConfigService;

  const routes = [
    { path: 'errors/403', component: ErrorPageComponent }
  ];

  const runGuard = (route: ActivatedRouteSnapshot) =>
    TestBed.runInInjectionContext(() =>
      collectionAccessGuard(route, {} as RouterStateSnapshot)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes)],
      providers: [AppConfigService]
    });
    router = TestBed.inject(Router);
    appConfigService = TestBed.inject(AppConfigService);
  });

  it('should deny access and redirect to 403 when viewcode matches globalViewName', () => {
    const result = runGuard(makeRoute(appConfigService.globalViewName));
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
  });

  it('should allow access when viewcode does not match globalViewName', () => {
    expect(runGuard(makeRoute('foo'))).toBe(true);
  });

  it('should fall back to parent params when viewcode is absent', () => {
    expect(runGuard(makeRoute(undefined, 'foo'))).toBe(true);
  });
});
