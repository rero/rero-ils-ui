/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { extractIdOnRef } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcqOrderApiService } from '../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../api/acq-receipt-api.service';
import { AcqOrderStatus, IAcqOrder } from '../../classes/order';
import { IAcqReceipt } from '../../classes/receipt';

function orderQuery(
  orderPid: string,
  acqOrderApiService: AcqOrderApiService,
  appStore: InstanceType<typeof AppStore>
): Observable<boolean> {
  const validStatuses = [AcqOrderStatus.ORDERED, AcqOrderStatus.PARTIALLY_RECEIVED, AcqOrderStatus.RECEIVED];
  return acqOrderApiService.getOrder(orderPid).pipe(
    map((order: IAcqOrder) => {
      if (appStore.currentLibraryPid() !== extractIdOnRef(order.library?.$ref ?? '')) {
        return false;
      }
      if (!order.is_current_budget) {
        return false;
      }
      return validStatuses.some(status => status === order.status);
    }),
    catchError(() => of(false))
  );
}

function receiptQuery(
  receiptPid: string,
  orderPid: string,
  acqReceiptApiService: AcqReceiptApiService
): Observable<boolean> {
  return acqReceiptApiService.getReceipt(receiptPid).pipe(
    map((receipt: IAcqReceipt) => orderPid === receipt.acq_order.pid),
    catchError(() => of(false))
  );
}

/**
 * Guard that verifies an order is eligible for receipt management.
 * When a `receipt` query param is present it also validates the receipt belongs to the order.
 * Redirects to /errors/400 (missing pid) or /errors/403 (conditions not met).
 */
export const canOrderReceiptGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const acqOrderApiService = inject(AcqOrderApiService);
  const acqReceiptApiService = inject(AcqReceiptApiService);
  const router = inject(Router);
  const appStore = inject(AppStore);

  const orderPid = route.params.pid;
  const receiptPid = route.queryParams.receipt;

  if (!orderPid) {
    router.navigate(['/errors/400'], { skipLocationChange: true });
    return of(false);
  }

  const order$ = orderQuery(orderPid, acqOrderApiService, appStore);

  if (!receiptPid) {
    return order$.pipe(
      map(valid => {
        if (!valid) {
          router.navigate(['/errors/403'], { skipLocationChange: true });
        }
        return valid;
      })
    );
  }

  return combineLatest([order$, receiptQuery(receiptPid, orderPid, acqReceiptApiService)]).pipe(
    map(([order, receipt]) => {
      if (!order || !receipt) {
        router.navigate(['/errors/403'], { skipLocationChange: true });
        return false;
      }
      return true;
    })
  );
};
