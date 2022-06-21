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
import { RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { userTestingService } from 'projects/admin/tests/utils';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { CanAccessGuard } from './can-access.guard';


describe('CanAccessGuard', () => {
  let guard: CanAccessGuard;
  let router: Router;
  let recordService: RecordService;

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
        $ref: 'https://localhost/api/organisations/1'
      }
    }
  };


  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.params = { type: 'items', pid: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userTestingService }
      ]
    });
    guard = TestBed.inject(CanAccessGuard);
    router = TestBed.inject(Router);
    recordService = TestBed.inject(RecordService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return a 400 error if any parameters are missing', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.params = {};
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return true if the item is part of the same organization', fakeAsync(() => {
    spyOn(recordService, 'getRecord').and.returnValue(of(record));
    guard.canActivate(activatedRouteSnapshotSpy)
      .subscribe((access: boolean) => {
        tick();
        expect(access).toBeTruthy();
      });
  }));

  it('should redirect to error 403 if the item does not belong to the same organization', fakeAsync(() => {
    const recordClone = cloneDeep(record);
    recordClone.metadata.organisation.$ref = 'https://localhost/api/organisations/2';
    spyOn(recordService, 'getRecord').and.returnValue(of(recordClone));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));
});
