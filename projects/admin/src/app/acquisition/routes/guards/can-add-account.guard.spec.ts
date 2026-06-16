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
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, firstValueFrom } from 'rxjs';
import { ErrorPageComponent } from '../../../error/error-page/error-page.component';
import { canAddAccountGuard } from './can-add-account.guard';
import { provideHttpClient } from '@angular/common/http';

describe('canAddAccountGuard', () => {
  let router: Router;

  const routes = [
    {
      path: 'errors/400',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.queryParams = { };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),
        TranslateModule.forRoot()],
    providers: [provideHttpClient(), provideHttpClientTesting()]
});
    router = TestBed.inject(Router);
  });

  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should be created', () => {
    expect(canAddAccountGuard).toBeTruthy();
  });

  it('should return a 400 error if the order parameter is not present in the url', async () => {
    const navPromise = waitForNavigation();
    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        canAddAccountGuard(activatedRouteSnapshotSpy, {} as RouterStateSnapshot)
      ) as any
    );
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  // Other tests are present in the can-add-order-line.guard.spec.ts file for the add function
});
