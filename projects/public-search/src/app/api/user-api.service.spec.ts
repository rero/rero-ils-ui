// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ApiService } from '@rero/ng-core';
import { of } from 'rxjs';
import { UserApiService } from './user-api.service';

describe('UserApiService', () => {
  let service: UserApiService;

  const apiResponse = {};
  const httpClientSpy = { post: vi.fn() };
  httpClientSpy.post.mockReturnValue(of(apiResponse));

  const apiServiceSpy = { getEndpointByType: vi.fn().mockReturnValue('/api/user/password/validate') };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: ApiService, useValue: apiServiceSpy }
      ]
    });
    service = TestBed.inject(UserApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update the password', () => {
    const passwordData = {
      password: 'A11111',
      new_password: 'B22333',
      new_password_confirm: 'B22333'
    };
    service.updatePassword(passwordData)
      .subscribe((result: any) => expect(result).toEqual(apiResponse));
  });

  it('should validate the password', () => {
    service.validatePassword('FooBar')
      .subscribe((result: any) => expect(result).toEqual(apiResponse))
  });
});
