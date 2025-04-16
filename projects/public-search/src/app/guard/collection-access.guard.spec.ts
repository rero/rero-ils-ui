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

import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { CollectionAccessGuard } from './collection-access.guard';
import { ActivatedRouteSnapshot, Router, RouterModule } from '@angular/router';
import { AppConfigService } from '../app-config.service';
import { ErrorPageComponent } from '../error/error-page.component';
import { cloneDeep } from 'lodash-es';

describe('CollectionAccessGuard', () => {

  let activatedRouteSnapshot: ActivatedRouteSnapshot;
  let router: Router;

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.data = {
    types: [
      {
        preFilters: {
          view: 'global'
        }
      }
    ]
  }

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes)
      ],
      providers: [
        CollectionAccessGuard,
        AppConfigService,
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotSpy }
      ]
    });
    activatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
    router = TestBed.inject(Router);
  });

  it('should create', inject([CollectionAccessGuard], (guard: CollectionAccessGuard) => {
    expect(guard).toBeTruthy();
  }));

  it('should not allow access', inject([CollectionAccessGuard], fakeAsync((guard: CollectionAccessGuard) => {
    guard.canActivate(activatedRouteSnapshot).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  })));

  it('should allow access', inject([CollectionAccessGuard], fakeAsync((guard: CollectionAccessGuard) => {
    const routeSnapshot = cloneDeep(activatedRouteSnapshot) as ActivatedRouteSnapshot;
    routeSnapshot.data.types[0].preFilters.view = 'foo';
    guard.canActivate(routeSnapshot).subscribe((access: boolean) => {
      expect(access).toBeTrue();
    })
  })));
});
