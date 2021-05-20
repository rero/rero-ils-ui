/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  testUserPatronMultipleOrganisationsWithSettings,
  UserApiService, UserService
} from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { of } from 'rxjs';
import { AcqAccountApiService } from './acq-account-api.service';
import { AcquisitionModule } from '../acquisition.module';

describe('AcqAccountApiService', () => {
  let service: AcqAccountApiService;
  let userService: UserService;

  const userApiServiceSpy = jasmine.createSpyObj('UserApiService', ['getLoggedUser']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot(),
        HttpClientTestingModule,
        AcquisitionModule
      ],
      providers: [
        { provide: UserApiService, useValue: userApiServiceSpy }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.inject(AcqAccountApiService);
    userApiServiceSpy.getLoggedUser.and.returnValue(of(cloneDeep(testUserPatronMultipleOrganisationsWithSettings)));
    userService = TestBed.inject(UserService);
    userService.load();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
