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
import { AppStore } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { filter, firstValueFrom } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { libraryGuard } from './library.guard';
import { provideHttpClient } from '@angular/common/http';


describe('libraryGuard', () => {
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.queryParams = { library: '1' };

  const appStoreSpy = { currentLibraryPid: vi.fn(() => '1') } as any;

  const runGuard = (route: any) =>
    TestBed.runInInjectionContext(() =>
      libraryGuard(route, {} as RouterStateSnapshot)
    ) as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),
        TranslateModule.forRoot()],
    providers: [
        { provide: AppStore, useValue: appStoreSpy },
        provideHttpClient(),
        provideHttpClientTesting()
    ]
});
    router = TestBed.inject(Router);
  });

  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should be created', () => {
    expect(libraryGuard).toBeTruthy();
  });

  it('should return true if the same library', async () => {
    const access = await firstValueFrom(runGuard(activatedRouteSnapshotSpy));
    expect(access).toBeTruthy();
  });

  it('should return a 403 error if the type is not correct', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams = { library: '2' };
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });
});
