/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { User, UserService } from '@rero/shared';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { RoleGuard } from './role.guard';
import { cloneDeep } from 'lodash-es';

describe('RoleGuard', () => {
  let guard: RoleGuard;
  let router: Router;
  let userService: UserService;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const user = {
    id: 1,
    first_name: 'first',
    last_name: 'last',
    birth_date: '1970-01-01',
    gender: 'Male',
    username: 'foo',
    keep_history: true,
    roles: ['user'],
    patrons: [{
      pid: '1',
      roles: [
        'system_librarian'
      ]
    }]
  };

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.data = { roles: ['system_librarian'] };

  const userServiceSpy = jasmine.createSpyObj(UserService, ['']);
  userServiceSpy.user = new User(user, []);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceSpy }
      ]
    });
    guard = TestBed.inject(RoleGuard);
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true if the user has the right role', () => {
    guard.canActivate(activatedRouteSnapshotSpy).subscribe((access: boolean) => {
      expect(access).toBeTruthy();
    });
  });

  it('should return false if the user has not the right role', () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.data = { roles: ['foo'] };
    guard.canActivate(activatedRoute).subscribe((access: boolean) => {
      expect(access).toBeFalsy();
    });
  });
});
