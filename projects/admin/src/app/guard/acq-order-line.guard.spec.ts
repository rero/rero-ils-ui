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
import { acqOrderLineGuard } from "./acq-order-line.guard";
import { of } from "rxjs";
import { RecordService } from "@rero/ng-core";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AppStore } from "@rero/shared";

describe('acqOrderLineGuard', () => {
  let route: ActivatedRouteSnapshot;

  const acqOrder = {
    metadata: {
      library: {
        $ref: '/api/libraries/10'
      }
    }
  };

  const recordServiceSpy = { getRecord: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(acqOrder));

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.queryParams = {
    order: 1
  };
  activatedRouteSnapshotSpy.params = {};

  const appStoreSpy = { currentLibraryPid: vi.fn(() => '10') } as any;

  const runGuard = (routeSnapshot: any) =>
    TestBed.runInInjectionContext(() =>
      acqOrderLineGuard(routeSnapshot, {} as RouterStateSnapshot)
    ) as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotSpy },
        { provide: AppStore, useValue: appStoreSpy }
      ]
    });

    route = TestBed.inject(ActivatedRouteSnapshot);
  });

  it('should be created', () => {
    expect(acqOrderLineGuard).toBeTruthy();
  });

  it('should return true when the library matches', () => {
    runGuard(route)
      .subscribe((result: boolean) => expect(result).toBe(true));
  });
});
