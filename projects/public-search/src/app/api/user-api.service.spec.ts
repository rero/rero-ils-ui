/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
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
