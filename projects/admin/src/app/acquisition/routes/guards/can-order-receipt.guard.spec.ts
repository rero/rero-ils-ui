/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { cloneDeep } from 'lodash-es';
import { userTestingService } from 'projects/admin/tests/utils';
import { of } from 'rxjs';
import { ErrorPageComponent } from '../../../error/error-page/error-page.component';
import { AcqOrderApiService } from '../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../api/acq-receipt-api.service';
import { AcqOrderStatus, AcqOrderType } from '../../classes/order';
import { CanOrderReceiptGuard } from './can-order-receipt.guard';

describe('CanOrderReceiptGuard', () => {
  let guard: CanOrderReceiptGuard;
  let acqOrderApiService: AcqOrderApiService;
  let acqReceiptApiService: AcqReceiptApiService;
  let router: Router;

  const routes = [
    {
      path: 'errors/400',
      component: ErrorPageComponent
    },
    {
      path: 'errors/403',
      component: ErrorPageComponent
    }
  ];

  const order = {
    reference: 'foo',
    priority: 1,
    type: AcqOrderType.MONOGRAPH,
    currency: 'CHF',
    order_date: new Date(),
    account_statement: {
      provisional: {
        total_amount: 100,
        quantity: 10
      },
      expenditure: {
        total_amount: 100,
        quantity: 10
      }
    },
    vendor: {
      $ref: 'http://localhost/api/vendors/1'
    },
    organisation: {
      $ref: 'https://localhost/api/organisations/1'
    },
    library: {
      $ref: 'https://localhost/api/libraries/1'
    },
    status: AcqOrderStatus.ORDERED,
    notes: [],
    is_current_budget: true
  };

  const receipt = {
    acq_order: {
      pid: '1',
    },
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
  };


  const activatedRouteSnapshotSpy = jasmine.createSpyObj('ActivatedRouteSnapshot', ['']);
  activatedRouteSnapshotSpy.params = { pid: '1' };
  activatedRouteSnapshotSpy.queryParams = { };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot(routes),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        CoreModule
      ],
      providers: [
        { provide: UserService, useValue: userTestingService }
      ]
    });
    guard = TestBed.inject(CanOrderReceiptGuard);
    acqOrderApiService = TestBed.inject(AcqOrderApiService);
    acqReceiptApiService = TestBed.inject(AcqReceiptApiService);
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return a 400 error if any parameters are missing', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.params = {};
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/400');
    });
  }));

  it('should return true if the order in status ordered (new receipt)', () => {
    spyOn(acqOrderApiService, 'getOrder').and.returnValue(of(order));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe((access: boolean) => {
      expect(access).toBeTruthy();
    });
  });

  it('should return a 403 error if the order in status received (new receipt)', fakeAsync(() => {
    const orderReceived = cloneDeep(order);
    orderReceived.status = AcqOrderStatus.RECEIVED;
    spyOn(acqOrderApiService, 'getOrder').and.returnValue(of(orderReceived));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('Should return a 403 error if the order is not on an active budget', fakeAsync(() => {
    const orderReceived = cloneDeep(order);
    orderReceived.is_current_budget = false;
    spyOn(acqOrderApiService, 'getOrder').and.returnValue(of(orderReceived));
    guard.canActivate(activatedRouteSnapshotSpy).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('should return a 403 error if the order and receipt in not the same order pid (update receipt)', fakeAsync(() => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams.receipt = '1';
    activatedRoute.params.pid = '2';
    spyOn(acqOrderApiService, 'getOrder').and.returnValue(of(order));
    spyOn(acqReceiptApiService, 'getReceipt').and.returnValue(of(receipt));
    guard.canActivate(activatedRoute).subscribe(() => {
      tick();
      expect(router.url).toBe('/errors/403');
    });
  }));

  it('should return true if the order and receipt in the same order pid (update receipt)', () => {
    const activatedRoute = cloneDeep(activatedRouteSnapshotSpy);
    activatedRoute.queryParams.receipt = '1';
    spyOn(acqOrderApiService, 'getOrder').and.returnValue(of(order));
    spyOn(acqReceiptApiService, 'getReceipt').and.returnValue(of(receipt));
    guard.canActivate(activatedRoute).subscribe((access: boolean) => {
      expect(access).toBeTruthy();
    });
  });
});
