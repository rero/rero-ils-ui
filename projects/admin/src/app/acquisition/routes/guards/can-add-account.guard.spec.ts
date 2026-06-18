// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter, firstValueFrom } from 'rxjs';
import { ErrorPageComponent } from '../../../error/error-page/error-page.component';
import { canAddAccountGuard } from './can-add-account.guard';
import { provideHttpClient } from '@angular/common/http';

describe('canAddAccountGuard', () => {
  let router: Router;

  const routes = [
    {
      path: 'errors/400',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.queryParams = { };

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),
        TranslateModule.forRoot()],
    providers: [provideHttpClient(), provideHttpClientTesting()]
});
    router = TestBed.inject(Router);
  });

  async function waitForNavigation(): Promise<void> {
    await firstValueFrom(
      router.events.pipe(filter(e => e instanceof NavigationEnd))
    );
  }

  it('should be created', () => {
    expect(canAddAccountGuard).toBeTruthy();
  });

  it('should return a 400 error if the order parameter is not present in the url', async () => {
    const navPromise = waitForNavigation();
    await firstValueFrom(
      TestBed.runInInjectionContext(() =>
        canAddAccountGuard(activatedRouteSnapshotSpy, {} as RouterStateSnapshot)
      ) as any
    );
    await navPromise;
    expect(router.url).toBe('/errors/400');
  });

  // Other tests are present in the can-add-order-line.guard.spec.ts file for the add function
});
