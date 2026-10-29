// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterModule, RouterStateSnapshot, UrlTree } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { MessageService, ToastMessageOptions } from '@openng/optimus-ui/api';
import { RecordService } from '@rero/ng-core';
import { apiResponse, AppStore } from '@rero/shared';
import { firstValueFrom, of } from 'rxjs';

import { ErrorPageComponent } from '../error/error-page/error-page.component';
import { itemAccessGuard } from './item-access.guard';

describe('itemAccessGuard', () => {
  let route: ActivatedRouteSnapshot;
  let routerState: RouterStateSnapshot;
  let messageService: MessageService;
  let router: Router;

  const routes = [{ path: '', component: ErrorPageComponent }];

  const item = {
    metadata: {
      pid: '1',
      holding: {
        $ref: '/api/holdings/2',
      },
    },
  };

  const holdings = {
    metadata: {
      library: {
        pid: '3',
      },
    },
  };
  const appStoreSpy = { currentLibraryPid: vi.fn(() => '10') } as any;

  const recordServiceSpy = { getRecord: vi.fn(), getRecords: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(item));

  const activatedRouteSnapshotSpy = {} as any;
  activatedRouteSnapshotSpy.params = {
    pid: '1',
  };

  const routerStateSnapshotSpy = {} as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot(routes)],
      providers: [
        provideTranslateService(),
        MessageService,
        { provide: AppStore, useValue: appStoreSpy },
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotSpy },
        { provide: RouterStateSnapshot, useValue: routerStateSnapshotSpy },
      ],
    });

    route = TestBed.inject(ActivatedRouteSnapshot);
    routerState = TestBed.inject(RouterStateSnapshot);
    messageService = TestBed.inject(MessageService);
    router = TestBed.inject(Router);

    apiResponse.hits.hits = [holdings];
    apiResponse.hits.total = apiResponse.hits.hits.length;
    recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  });

  it('should be created', () => {
    expect(itemAccessGuard).toBeTruthy();
  });

  it('should display a message and return a UrlTree if access is denied', async () => {
    messageService.messageObserver.subscribe((message: ToastMessageOptions) => {
      expect(message.severity).toEqual('warn');
      expect(message.detail).toEqual('Access denied');
    });
    const result = await firstValueFrom(
      TestBed.runInInjectionContext(() => itemAccessGuard(route, routerState)) as any,
    );
    expect(result instanceof UrlTree).toBeTruthy();
    expect(router.serializeUrl(result as UrlTree)).toBe('/');
  });
});
