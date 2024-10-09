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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { userTestingService } from 'projects/admin/tests/utils';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { LibraryGuard } from './library.guard';


describe('LibraryGuard', () => {
  let guard: LibraryGuard;
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.queryParams = { library: '1' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: UserService, useValue: userTestingService }
      ]
    });
    guard = TestBed.inject(LibraryGuard);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the same library', () => {
    guard.canActivate(activatedRouteSnapshotSpy).subscribe((access: boolean) => {
      expect(access).toBeTruthy();
    });
  });

  it('should return a 403 error if the type is not correct', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams = { library: '2' };
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));
});
