// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { libraryGuard } from './library.guard';
import { provideHttpClient } from '@angular/common/http';


describe('libraryGuard', () => {
  let router: Router;

  const routes = [
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.queryParams = { library: '1' };

  const appStoreSpy = { currentLibraryPid: vi.fn(() => '1') } as any;

  const runGuard = (route: any) =>
    TestBed.runInInjectionContext(() =>
      libraryGuard(route, {} as RouterStateSnapshot)
    ) as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterModule.forRoot(routes),
        TranslateModule.forRoot()],
    providers: [
        { provide: AppStore, useValue: appStoreSpy },
        provideHttpClient(),
        provideHttpClientTesting()
    ]
});
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(libraryGuard).toBeTruthy();
  });

  it('should return true if the same library', async () => {
    const access = await firstValueFrom(runGuard(activatedRouteSnapshotSpy));
    expect(access).toBeTruthy();
  });

  it('should return a 403 UrlTree if the library does not match', async () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams = { library: '2' };
    const result = await firstValueFrom(runGuard(activatedRoute));
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/errors/403');
  });
});
