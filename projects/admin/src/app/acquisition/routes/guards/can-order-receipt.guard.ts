/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { extractIdOnRef } from '@rero/ng-core';
import { IUserLocaleStorage, UserService } from '@rero/shared';
import { combineLatest, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AcqOrderService } from '../../services/acq-order.service';
import { AcqReceiptService } from '../../services/acq-receipt.service';
import { AcqOrder, AcqOrderStatus } from '../../classes/order';
import { AcqReceipt } from '../../classes/receipt';

@Injectable({
  providedIn: 'root'
})
export class CanOrderReceiptGuard implements CanActivate {

  /**
   * Constructor
   * @param _acqOrderService - AcqOrderService
   * @param _acqReceiptService - AcqReceiptService
   * @param _router - Router
   * @param _userService - UserService
   */
  constructor(
    private _acqOrderService: AcqOrderService,
    private _acqReceiptService: AcqReceiptService,
    private _router: Router,
    private _userService: UserService
  ) {}

  /**
   * Can activate
   * @param route - ActivatedRouteSnapshot
   * @param state - RouterStateSnapshot
   * @returns Observable
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const orderPid = route.paramMap.get('pid');
      const receiptPid = route.queryParams.receipt;
      if (!receiptPid) {
        this._orderQuery(orderPid).subscribe((validate: boolean) => {
          if (!validate) {
            this._router.navigate(['/errors/403'], { skipLocationChange: true });
          }
        });
      } else {
        combineLatest([this._orderQuery(orderPid), this._receiptQuery(receiptPid, orderPid)])
        .subscribe(([order, receipt]) => {
          if (!order || !receipt) {
            this._router.navigate(['/errors/403'], { skipLocationChange: true });
          }
        });
      }
      return true;
  }

  /**
   * Check if an order has requirement to manage a receipt anymore.
   *
   * To manage a receipt, the related order must be related to the current user library and
   * the order status should be ORDERED or PARTIALLY RECEIVED
   * @param orderPid - the order pid
   * @returns Observable<boolean>: True if a receipt could be managed, False otherwise
   */
  private _orderQuery(orderPid: string): Observable<boolean> {
    return this._acqOrderService
      .getOrder(orderPid)
      .pipe(
        map((order: AcqOrder) => {
          const userLocale: IUserLocaleStorage = this._userService.getOnLocaleStorage();
          if (userLocale.currentLibrary !== extractIdOnRef(order.library.$ref)) {
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
    return this._acqReceiptService
      .getReceipt(receiptPid)
      .pipe(
        map((receipt: AcqReceipt) => orderPid === receipt.acq_order.pid),
        catchError(() => of(false))
      );
  }
}
