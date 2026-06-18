// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@rero/ng-core';
import { of } from 'rxjs';
import { UserApiService } from './user-api.service';

describe('Service: UserApi', () => {

  let userApiService: UserApiService;

  const record = {
    medatadata: { pid: 1 },
    settings: { language: 'fr' }
  };

  const httpClientSpy = {
    get: vi.fn().mockReturnValue(of(record)),
    post: vi.fn().mockReturnValue(of(true))
  };

  const apiServiceSpy = { endpointPrefix: '/api' };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        UserApiService,
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ApiService, useValue: apiServiceSpy }
    ]
});
    userApiService = TestBed.inject(UserApiService);
  });

  it('should create a service', () => {
    expect(userApiService).toBeTruthy();
  });

  it('should return a logged user data', () => {
    userApiService.getLoggedUser().subscribe((data: any) => {
      expect(data).toEqual(record);
    });
  });

  it('should return a boolean on the password change', () => {
    userApiService.changePassword('foo', 'bar').subscribe((post: any) => {
      expect(post).toBeTruthy();
    });
  });
});
