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
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule, RecordService } from '@rero/ng-core';
import { cloneDeep } from 'lodash-es';
import { of, throwError } from 'rxjs';
import { ErrorPageComponent } from '../../../error/error-page/error-page.component';
import { CanAddOrderLineGuard } from './can-add-order-line.guard';

describe('CanAddOrderLineGuard', () => {
  let guard: CanAddOrderLineGuard;
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

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.queryParams = { };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ]
    });
    guard = TestBed.inject(CanAddOrderLineGuard);
    recordService = TestBed.inject(RecordService);
    router = TestBed.inject(Router);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return a 400 error if the order parameter is not present in the url', fakeAsync(() => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    guard.canActivate(activatedRouteSnapshot).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return true if the record has the flag true on is_current_budget', () => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    activatedRouteSnapshot.queryParams.order = 12;
    const record = cloneDeep(order);
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshot).subscribe((access: boolean) => {
      expect(access).toBeTruthy();
    });
  });

  it('should return a 403 error if the order record has the flag true on is_current_budget', fakeAsync(() => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    activatedRouteSnapshot.queryParams.order = 12;
    const record = cloneDeep(order);
    record.metadata.is_current_budget = false;
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshot).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('should return a 404 error if http client return a 404 error', fakeAsync(() => {
    const activatedRouteSnapshot = cloneDeep(activatedRouteSnapshotSpy);
    activatedRouteSnapshot.queryParams.order = 12;
    const record = cloneDeep(order);
    record.metadata.is_current_budget = false;

    const errorResponse = new HttpErrorResponse({
      error: '404 error',
      status: 404,
      statusText: 'Not Found'
    });
    spyOn(httpClient, 'get').and.returnValue(throwError(errorResponse));
    guard.canActivate(activatedRouteSnapshot).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/404');
    });
  }));
});
