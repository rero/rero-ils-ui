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
import { itemAccessGuard } from "./item-access.guard";
import { AppStore } from "@rero/shared";
import { of } from "rxjs";
import { apiResponse } from "@rero/shared";
import { RecordService } from "@rero/ng-core";
import { TranslateModule } from "@ngx-translate/core";
import { MessageService, ToastMessageOptions } from "primeng/api";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

describe('itemAccessGuard', () => {
  let route: ActivatedRouteSnapshot;
  let routerState: RouterStateSnapshot;
  let messageService: MessageService;

  const item = {
    metadata: {
      pid: '1',
      holding: {
        $ref: '/api/holdings/2'
      }
    }
  };

  const holdings = {
    metadata: {
      library: {
        pid: '3'
      }
    }
  };
  const appStoreSpy = { currentLibraryPid: vi.fn(() => '10') } as any;

  const recordServiceSpy = { getRecord: vi.fn(), getRecords: vi.fn(), totalHits: vi.fn() };
  recordServiceSpy.getRecord.mockReturnValue(of(item));
  recordServiceSpy.totalHits.mockReturnValue(1);

  const activatedRouteSnapshotSpy = { } as any;
  activatedRouteSnapshotSpy.params = {
    pid: '1'
  };

  const routerStateSnapshotSpy = { } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        MessageService,
        { provide: AppStore, useValue: appStoreSpy },
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotSpy },
        { provide: RouterStateSnapshot, useValue: routerStateSnapshotSpy }
      ]
    });

    route = TestBed.inject(ActivatedRouteSnapshot);
    routerState = TestBed.inject(RouterStateSnapshot);
    messageService = TestBed.inject(MessageService);

    apiResponse.hits.hits = [holdings];
    recordServiceSpy.getRecords.mockReturnValue(of(apiResponse));
  });

  it('should be created', () => {
    expect(itemAccessGuard).toBeTruthy();
  });

  it('should display a message if access is denied', () => {
    messageService.messageObserver
      .subscribe((message: ToastMessageOptions) => {
        expect(message.severity).toEqual('warn');
        expect(message.detail).toEqual('Access denied');
      });
    TestBed.runInInjectionContext(() => itemAccessGuard(route, routerState));
  });
});
