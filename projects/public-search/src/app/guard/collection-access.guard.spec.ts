/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { filter, firstValueFrom } from 'rxjs';
import { AppConfigService } from '../app-config.service';
import { ErrorPageComponent } from '../error/error-page.component';
import { collectionAccessGuard } from './collection-access.guard';

const waitForNavigation = (router: Router): Promise<void> =>
  firstValueFrom(router.events.pipe(filter(e => e instanceof NavigationEnd))).then(() => undefined);

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

  const runGuard = (route: ActivatedRouteSnapshot): boolean =>
    TestBed.runInInjectionContext(() =>
      collectionAccessGuard(route, {} as RouterStateSnapshot) as boolean
    );

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes)],
      providers: [AppConfigService]
    });
    router = TestBed.inject(Router);
    appConfigService = TestBed.inject(AppConfigService);
  });

  it('should deny access and redirect to 403 when viewcode matches globalViewName', async () => {
    const navPromise = waitForNavigation(router);
    expect(runGuard(makeRoute(appConfigService.globalViewName))).toBe(false);
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });

  it('should allow access when viewcode does not match globalViewName', () => {
    expect(runGuard(makeRoute('foo'))).toBe(true);
  });

  it('should fall back to parent params when viewcode is absent', () => {
    expect(runGuard(makeRoute(undefined, 'foo'))).toBe(true);
  });
});
