/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { userTestingService } from 'projects/admin/tests/utils';
import { of } from 'rxjs';
import { LocalFieldApiService } from '../api/local-field-api.service';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { CanAddLocalFieldsGuard } from './can-add-local-fields.guard';

describe('CanAddLocalFieldsGuard', () => {

  let guard: CanAddLocalFieldsGuard;
  let localFieldApiService: LocalFieldApiService;
  let router: Router;

  const routes = [
    {
      path: 'errors/400',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.queryParams = { type: 'documents', ref: '240' };

  let record = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      providers: [
        { provide: UserService, useValue: userTestingService }
      ]
    });
    guard = TestBed.inject(CanAddLocalFieldsGuard);
    localFieldApiService = TestBed.inject(LocalFieldApiService);
    router = TestBed.inject(Router);
  });

  it('should create a service', () => {
    expect(guard).toBeTruthy();
  });

  it('should return a 400 error if any parameters are missing', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams = {};
    spyOn(localFieldApiService, 'getByResourceTypeAndResourcePidAndOrganisationId').and.returnValue(of(record));
    guard.canActivate(
      activatedRoute
    ).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return false if the current document has a local fields', () => {
    record = { metadata: { } };
    spyOn(localFieldApiService, 'getByResourceTypeAndResourcePidAndOrganisationId').and.returnValue(of(record));
    guard.canActivate(
      activatedRouteSnapshotSpy
    ).subscribe((access: boolean) => {
      expect(access).toBeFalsy();
    });
  });

  it('should return a 400 error if the type is not correct', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams = { type: 'foo', ref: '240' };
    spyOn(localFieldApiService, 'getByResourceTypeAndResourcePidAndOrganisationId').and.returnValue(of(record));
    guard.canActivate(
      activatedRoute
    ).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));
});
