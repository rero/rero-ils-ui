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
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { cloneDeep } from 'lodash-es';
import { filter, firstValueFrom, of, throwError } from 'rxjs';
import { ErrorPageComponent } from '../../../error/error-page/error-page.component';
import { canAddOrderLineGuard } from './can-add-order-line.guard';

describe('canAddOrderLineGuard', () => {
  let recordService: RecordService;
  let router: Router;
  let httpClient: HttpClient;

  const routes = [
    {
      path: 'errors/400',
      component: ErrorPageComponent
    },
    {
      path: 'errors/403',
      component: ErrorPageComponent
    },
    {
      path: 'errors/404',
      component: ErrorPageComponent
    }
  ];

  const order = {
    metadata: {
      pid: 12,
      is_current_budget: true
    }
  };

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.queryParams = { };

  const runGuard = (route: any) =>
    TestBed.runInInjectionContext(() =>
      canAddOrderLineGuard(route, {} as RouterStateSnapshot)
    ) as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),
        TranslateModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    recordService = TestBed.inject(RecordService);
    router = TestBed.inject(Router);
    httpClient = TestBed.inject(HttpClient);
  });

  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should be created', () => {
    expect(canAddOrderLineGuard).toBeTruthy();
  });

  it('should return a 400 error if the order parameter is not present in the url', async () => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRouteSnapshot));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  it('should return true if the record has the flag true on is_current_budget', async () => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    activatedRouteSnapshot.queryParams.order = 12;
    const record = cloneDeep(order);
    vi.spyOn(recordService, 'getRecord').mockReturnValue(of(record));
    const access = await firstValueFrom(runGuard(activatedRouteSnapshot));
    expect(access).toBeTruthy();
  });

  it('should return a 403 error if the order record has the flag true on is_current_budget', async () => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    activatedRouteSnapshot.queryParams.order = 12;
    const record = cloneDeep(order);
    record.metadata.is_current_budget = false;
    vi.spyOn(recordService, 'getRecord').mockReturnValue(of(record));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRouteSnapshot));
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });

  it('should return a 404 error if http client return a 404 error', async () => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    activatedRouteSnapshot.queryParams.order = 12;
    const record = cloneDeep(order);
    record.metadata.is_current_budget = false;

    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    });
    vi.spyOn(httpClient, 'get').mockReturnValue(throwError(errorResponse));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRouteSnapshot));
    await navPromise;
    expect(router.url).toBe('/errors/404');
  });
});
