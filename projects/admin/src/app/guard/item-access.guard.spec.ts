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
import { ItemAccessGuard } from "./item-access.guard";
import { UserService } from "@rero/shared";
import { of } from "rxjs";
import { apiResponse } from "projects/shared/src/tests/api";
import { RecordService } from "@rero/ng-core";
import { TranslateModule } from "@ngx-translate/core";
import { MessageService, ToastMessageOptions } from "primeng/api";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

describe('ItemAccessGuard', () => {
  let guard: ItemAccessGuard;
  let route: ActivatedRouteSnapshot;
  let router: RouterStateSnapshot;
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
  const userServiceSpy = jasmine.createSpyObj('userService', ['']);
  userServiceSpy.user = {
    currentLibrary: '10'
  }

  const recordServiceSpy = jasmine.createSpyObj('recordService', ['getRecord', 'getRecords', 'totalHits']);
  recordServiceSpy.getRecord.and.returnValue(of(item));
  recordServiceSpy.totalHits.and.returnValue(1);

  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.params = {
    pid: '1'
  };

  const routerStateSnapshotSpy = jasmine.createSpyObj('RouterStateSnapshot', ['']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        ItemAccessGuard,
        MessageService,
        { provide: UserService, useValue: userServiceSpy },
        { provide: RecordService, useValue: recordServiceSpy },
        { provide: ActivatedRouteSnapshot, useValue: activatedRouteSnapshotSpy },
        { provide: RouterStateSnapshot, useValue: routerStateSnapshotSpy }
      ]
    });

    guard = TestBed.inject(ItemAccessGuard);
    route = TestBed.inject(ActivatedRouteSnapshot);
    router = TestBed.inject(RouterStateSnapshot);
    messageService = TestBed.inject(MessageService);

    apiResponse.hits.hits = [holdings];
    recordServiceSpy.getRecords.and.returnValue(of(apiResponse));
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should display a message if access is denied', () => {
    messageService.messageObserver
      .subscribe((message: ToastMessageOptions) => {
        expect(message.severity).toEqual('warn');
        expect(message.detail).toEqual('Access denied');
      });
      guard.canActivate(route, router);
  });
});
