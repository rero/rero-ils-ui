/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserApiService } from './user-api.service';
import { ApiService } from '@rero/ng-core';

describe('Service: UserApi', () => {

  let userApiService: UserApiService;

  const record = {
    medatadata: { pid: 1 },
    settings: { language: 'fr' }
  };

  const httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
  httpClientSpy.get.and.returnValue(of(record));
  httpClientSpy.post.and.returnValue(of(true));

  const apiServiceSpy = jasmine.createSpyObj('ApiService', ['']);
  apiServiceSpy.endpointPrefix = '/api';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
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
