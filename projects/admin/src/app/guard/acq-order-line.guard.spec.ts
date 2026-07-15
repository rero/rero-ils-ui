// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from "@angular/core/testing";
import { acqOrderLineGuard } from "./acq-order-line.guard";
import { cloneDeep } from 'lodash-es';
import { firstValueFrom, of, throwError } from "rxjs";
import { RecordService } from "@rero/ng-core";
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, UrlTree } from "@angular/router";
import { AppStore } from "@rero/shared";
import { ErrorPageComponent } from '../error/error-page/error-page.component';

describe('acqOrderLineGuard', () => {
  let route: ActivatedRouteSnapshot;
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    },
    {
      path: 'errors/500',
      component: ErrorPageComponent
    }
  ];

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
      imports: [RouterModule.forRoot(routes)],
      providers: [
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotSpy },
        { provide: AppStore, useValue: appStoreSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    route = TestBed.inject(ActivatedRouteSnapshot);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(acqOrderLineGuard).toBeTruthy();
  });

  it('should return true when the library matches', async () => {
    const result = await firstValueFrom(runGuard(route));
    expect(result).toBe(true);
  });

  it('should return a 403 UrlTree if the library does not match', async () => {
    appStoreSpy.currentLibraryPid.mockReturnValueOnce('99');
    const result = await firstValueFrom(runGuard(cloneDeep(route)));
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
  });

  it('should return a 500 UrlTree if the record service fails', async () => {
    recordServiceSpy.getRecord.mockReturnValueOnce(throwError(() => new Error('boom')));
    const result = await firstValueFrom(runGuard(cloneDeep(route)));
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/500');
  });
});
