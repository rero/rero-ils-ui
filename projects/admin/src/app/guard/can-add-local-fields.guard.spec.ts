// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecordUiService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { filter, firstValueFrom } from 'rxjs';
import { of } from 'rxjs';
import { LocalFieldApiService } from '../api/local-field-api.service';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { canAddLocalFieldsGuard } from './can-add-local-fields.guard';
import { provideHttpClient } from '@angular/common/http';

describe('canAddLocalFieldsGuard', () => {

  let localFieldApiService: LocalFieldApiService;
  let router: Router;

  const routes = [
    {
      path: 'errors/400',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.queryParams = { type: 'documents', ref: '240' };

  let record = {};

  const appStoreSpy = { currentOrganisationPid: vi.fn(() => '1') } as any;

  const runGuard = (route: any) =>
    TestBed.runInInjectionContext(() =>
      canAddLocalFieldsGuard(route, {} as RouterStateSnapshot)
    ) as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),
        TranslateModule.forRoot()],
    providers: [
        { provide: AppStore, useValue: appStoreSpy },
        { provide: RecordUiService, useValue: {} },
        provideHttpClient(),
        provideHttpClientTesting()
    ]
});
    localFieldApiService = TestBed.inject(LocalFieldApiService);
    router = TestBed.inject(Router);
  });

  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should create a service', () => {
    expect(canAddLocalFieldsGuard).toBeTruthy();
  });

  it('should return a 400 error if any parameters are missing', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams = {};
    vi.spyOn(localFieldApiService, 'getByResourceTypeAndResourcePidAndOrganisationId').mockReturnValue(of(record));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  it('should return false if the current document has a local fields', async () => {
    record = { metadata: { } };
    vi.spyOn(localFieldApiService, 'getByResourceTypeAndResourcePidAndOrganisationId').mockReturnValue(of(record));
    const access = await firstValueFrom(runGuard(activatedRouteSnapshotSpy));
    expect(access).toBeFalsy();
  });

  it('should return a 400 error if the type is not correct', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams = { type: 'foo', ref: '240' };
    vi.spyOn(localFieldApiService, 'getByResourceTypeAndResourcePidAndOrganisationId').mockReturnValue(of(record));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRoute));
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });
});
