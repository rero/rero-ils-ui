// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient, provideHttpClient } from '@angular/common/http';
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
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(PermissionApiService);
    client = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a list of all available permissions', () => {
    vi.spyOn(client, 'get').mockReturnValue(of(responseRolesPermissions))
    service.getAllPermissionsByRole().subscribe((result: IRolePermission) => {
      expect(result).toEqual(responseRolesPermissions);
    });
  });

  it('should return the list of user permissions', () => {
    vi.spyOn(client, 'get').mockReturnValue(of(responseUserPermissions))
    service.getUserPermissions('1').subscribe((result: any) => {
      expect(result).toEqual(responseUserPermissions);
    });
  });
});
