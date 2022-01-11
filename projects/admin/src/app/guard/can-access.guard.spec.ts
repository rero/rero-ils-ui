/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { LocalStorageService, RecordService } from '@rero/ng-core';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { CanAccessGuard } from './can-access.guard';
import { cloneDeep } from 'lodash-es';


describe('CanAccessGuard', () => {
  let guard: CanAccessGuard;
  let router: Router;
  let recordService: RecordService;
  let localStorageService: LocalStorageService;

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

  const record = {
    metadata: {
      pid: 1,
      organisation: {
        pid: '1'
      }
    }
  };

  const localStorageData = {
    currentLibrary: 1,
    currentOrganisation: 1
  };

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.params = { type: 'items', pid: '1' };

  const routerStateSnapshotSpy = jasmine.createSpyObj('RouterStateSnapshot', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ]
    });
    guard = TestBed.inject(CanAccessGuard);
    router = TestBed.inject(Router);
    recordService = TestBed.inject(RecordService);
    localStorageService = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return a 400 error if any parameters are missing', fakeAsync(() => {
    spyOn(localStorageService, 'get').and.returnValue(localStorageData);
    spyOn(localStorageService, 'has').and.returnValue(true);
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.params = {};
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRoute, routerStateSnapshotSpy);
    tick();
    expect(router.url).toBe('/errors/400');
  }));

  it('should return a 400 error if the user is missing', fakeAsync(() => {
    spyOn(localStorageService, 'get').and.returnValue(null);
    spyOn(localStorageService, 'has').and.returnValue(false);
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshotSpy, routerStateSnapshotSpy);
    tick();
    expect(router.url).toBe('/errors/400');
  }));

  it('should return true if the item is part of the same organization', () => {
    spyOn(localStorageService, 'get').and.returnValue(localStorageData);
    spyOn(localStorageService, 'has').and.returnValue(true);
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    expect(guard.canActivate(
      activatedRouteSnapshotSpy, routerStateSnapshotSpy
    )).toBeTruthy();
  });

  it('should redirect to error 403 if the item does not belong to the same organization', fakeAsync(() => {
    spyOn(localStorageService, 'get').and.returnValue(localStorageData);
    spyOn(localStorageService, 'has').and.returnValue(true);
    record.metadata.organisation.pid = '2';
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshotSpy, routerStateSnapshotSpy);
    tick();
    expect(router.url).toBe('/errors/403');
  }));
});
