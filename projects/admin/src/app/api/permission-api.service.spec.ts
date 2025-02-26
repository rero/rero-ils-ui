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
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { IRolePermission, PermissionApiService } from './permission-api.service';

describe('PermissionService', () => {
  let service: PermissionApiService;
  let client: HttpClient;

  const responseRolesPermissions: IRolePermission = {
    patron: {
      actions: {
        'ptrn-read': true,
        'ptrn-create': false
      },
      type: 'role'
    }
  };

  const responseUserPermissions: any = {}

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(PermissionApiService);
    client = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of all available permissions', () => {
    spyOn(client, 'get').and.returnValue(of(responseRolesPermissions))
    service.getAllPermissionsByRole().subscribe((result: IRolePermission) => {
      expect(result).toEqual(responseRolesPermissions);
    });
  });

  it('should return the list of user permissions', () => {
    spyOn(client, 'get').and.returnValue(of(responseUserPermissions))
    service.getUserPermissions('1').subscribe((result: any) => {
      expect(result).toEqual(responseUserPermissions);
    });
  });
});
