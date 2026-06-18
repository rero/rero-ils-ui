// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { cloneDeep } from 'lodash-es';
import { filter, firstValueFrom, of } from 'rxjs';
import { ErrorPageComponent } from '../../../error/error-page/error-page.component';
import { isBudgetActiveGuard } from './is-budget-active.guard';
import { provideHttpClient } from '@angular/common/http';

describe('isBudgetActiveGuard', () => {
  let recordService: RecordService;
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const receipt = {
    metadata: {
      acq_order: {
        pid: '1' },
      exchange_rate: 1,
      amount_adjustments: [{
        label: 'amount',
        amount: 10,
        acq_account: {
          $ref: 'https://localhost/api/acq_accounts/1'
        }
      }],
      organisation: {
        $ref: 'https://localhost/api/organisations/1'
      },
      notes: [],
      is_current_budget: true
    }
  };

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.params = { type: 'acq_receipt', pid: '1' };
  activatedRouteSnapshotSpy.queryParams = { };

  const runGuard = (route: any) =>
    TestBed.runInInjectionContext(() =>
      isBudgetActiveGuard(route, {} as RouterStateSnapshot)
    ) as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),
        TranslateModule.forRoot()],
    providers: [provideHttpClient(), provideHttpClientTesting()]
});
    recordService = TestBed.inject(RecordService);
    router = TestBed.inject(Router);
  });

  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should be created', () => {
    expect(isBudgetActiveGuard).toBeTruthy();
  });

  it('should return true if the record has the flag true on is_current_budget', async () => {
    const record = cloneDeep(receipt);
    vi.spyOn(recordService, 'getRecord').mockReturnValue(of(record));
    const access = await firstValueFrom(runGuard(activatedRouteSnapshotSpy));
    expect(access).toBeTruthy();
  });

  it('should return a 403 error if the record has the flag false on is_current_budget', async () => {
    const record = cloneDeep(receipt);
    record.metadata.is_current_budget = false;
    vi.spyOn(recordService, 'getRecord').mockReturnValue(of(record));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRouteSnapshotSpy));
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });

  it('should return a 403 error if the record does not have the field is_current_budget', async () => {
    const record = cloneDeep(receipt);
    delete (record as any).is_current_budget;
    record.metadata.is_current_budget = false;
    vi.spyOn(recordService, 'getRecord').mockReturnValue(of(record));
    const navPromise = waitForNavigation();
    await firstValueFrom(runGuard(activatedRouteSnapshotSpy));
    await navPromise;
    expect(router.url).toBe('/errors/403');
  });
});
