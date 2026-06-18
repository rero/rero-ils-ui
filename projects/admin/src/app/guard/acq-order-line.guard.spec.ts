// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

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
