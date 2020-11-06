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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from '@rero/ng-core';
import { of } from 'rxjs';
import { LocalFieldApiService } from '../api/local-field-api.service';
import { CanAddLocalFieldsGuard } from './can-add-local-fields.guard';


describe('CanAddLocalFieldsGuard', () => {

  let canAddLocalFieldsGuard: CanAddLocalFieldsGuard;

  const localFieldsApiServiceSpy = jasmine.createSpyObj(
    'LocalFieldApiService', [
      'getByResourceTypeAndResourcePidAndOrganisationId'
    ]
  );
  localFieldsApiServiceSpy
    .getByResourceTypeAndResourcePidAndOrganisationId
    .and.returnValue(of({}));

  const localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', ['get']);
  localStorageServiceSpy.get.and.returnValue({
    currentLibrary: 1,
    currentOrganisation: 1
  });

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.queryParams = {type: 'documents', ref: '240'};

  const routerStateSnapshotSpy = jasmine.createSpyObj('RouterStateSnapshot', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        CanAddLocalFieldsGuard,
        { provide: LocalFieldApiService, useValue: localFieldsApiServiceSpy },
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
      ]
    });
    canAddLocalFieldsGuard = TestBed.inject(CanAddLocalFieldsGuard);
  });

  it('should create a service', () => {
    expect(canAddLocalFieldsGuard).toBeTruthy();
  });

  it('should return true if the url parameters are right', () => {
    expect(canAddLocalFieldsGuard.canActivate(
      activatedRouteSnapshotSpy, routerStateSnapshotSpy
    )).toBeTruthy();
  });
});
