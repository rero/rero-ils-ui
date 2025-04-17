/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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

import { TestBed } from "@angular/core/testing";
import { AcqOrderLineGuard } from "./acq-order-line.guard";
import { of } from "rxjs";
import { RecordService } from "@rero/ng-core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { UserService } from "@rero/shared";

describe('AcqOrderLineGuard', () => {
  let guard: AcqOrderLineGuard;
  let route: ActivatedRouteSnapshot;

  const acqOrder = {
    metadata: {
      library: {
        $ref: '/api/libraries/10'
      }
    }
  };

  const recordServiceSpy = jasmine.createSpyObj('RecordService', ['getRecord']);
  recordServiceSpy.getRecord.and.returnValue(of(acqOrder));

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.queryParams = {
    order: 1
  };

  const userServiceSpy = jasmine.createSpyObj('UserService', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcqOrderLineGuard,
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotSpy },
        { provide: UserService, useValue: userServiceSpy }
      ]
    });

    guard = TestBed.inject(AcqOrderLineGuard);
    route = TestBed.inject(ActivatedRouteSnapshot);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return the library id', () => {
    guard.getOwningLibrary$(route)
      .subscribe((libraryPid: string) => expect(libraryPid).toEqual('10'));
  });
});
