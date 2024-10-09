/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { extractIdOnRef } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcqOrderApiService } from '../../api/acq-order-api.service';
import { AcqReceiptApiService } from '../../api/acq-receipt-api.service';
import { AcqOrderStatus, IAcqOrder } from '../../classes/order';
import { IAcqReceipt } from '../../classes/receipt';

@Injectable({
  providedIn: 'root'
})
export class CanOrderReceiptGuard  {

  private acqOrderApiService: AcqOrderApiService = inject(AcqOrderApiService);
  private acqReceiptApiService: AcqReceiptApiService = inject(AcqReceiptApiService);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);

  /**
   * Can activate
   * @param route - ActivatedRouteSnapshot
   * @returns True if the conditions is satisfied
   * @throws redirect to error 403 or 400
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
      const orderPid = route.params.pid;
      const receiptPid = route.queryParams.receipt;
      if (orderPid) {
        if (!receiptPid) {
          return this._orderQuery(orderPid).pipe(
            map((validate: boolean) => {
              if (!validate) {
                this.router.navigate(['/errors/403'], { skipLocationChange: true });
                return false;
              }
              return true;
            })
          );
        } else {
          return combineLatest([
            this._orderQuery(orderPid),
            this._receiptQuery(receiptPid, orderPid)
          ]).pipe(
            map(([order, receipt]) => {
              if (!order || !receipt) {
                this.router.navigate(['/errors/403'], { skipLocationChange: true });
                return false;
              }
              return true;
            })
          );
        }
      } else {
        this.router.navigate(['/errors/400'], { skipLocationChange: true });
        return of(false);
      }
  }

  /**
   * Check if an order has requirement to manage a receipt anymore.
   * To manage a receipt, the related order must be related to the current user library and
   * the order status should be ORDERED or PARTIALLY RECEIVED
   * @param orderPid - the order pid
   * @returns Observable<boolean>: True if a receipt could be managed, False otherwise
   */
  private _orderQuery(orderPid: string): Observable<boolean> {
    return this.acqOrderApiService.getOrder(orderPid).pipe(
        map((order: IAcqOrder) => {
          if (this.userService.user.currentLibrary !== extractIdOnRef(order.library.$ref)) {
            return false;
          }
          if (!order.is_current_budget) {
            return false;
          }
          const validStatuses = [AcqOrderStatus.ORDERED, AcqOrderStatus.PARTIALLY_RECEIVED];
          return validStatuses.some((key: string) => key === order.status);
        }),
        catchError(() => of(false))
      );
  }

  /**
   * Check if a specific receipt is allowed regarding an order
   * @param receiptPid: the receipt pid
   * @param orderPid: the order pid
   * @returns Observable<boolean>: True if the receipt is well related to this order
   */
  private _receiptQuery(receiptPid: string, orderPid: string): Observable<boolean> {
    return this.acqReceiptApiService.getReceipt(receiptPid).pipe(
        map((receipt: IAcqReceipt) => orderPid === receipt.acq_order.pid),
        catchError(() => of(false))
      );
  }
}
