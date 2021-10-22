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
import { AcqOrderApiService } from '../api/acq-order-api.service';
import { AcqReceiptApiService } from '../api/acq-receipt-api.service';
import { AcqOrderStatus } from '../classes/order';
import { IReceiptOrder } from '../classes/receipt';

@Injectable({
  providedIn: 'root'
})
export class CanOrderReceiptGuard implements CanActivate {

  /** $ref column name */
  readonly ref = '$ref';

  /**
   * Constructor
   * @param _acqOrderApiService - AcqOrderApiService
   * @param _acqReceiptApiService - AcqReceiptApiService
   * @param _router - Router
   */
  constructor(
    private _acqOrderApiService: AcqOrderApiService,
    private _acqReceiptApiService: AcqReceiptApiService,
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
          if (!order) {
            this._router.navigate(['/errors/403'], { skipLocationChange: true });
          } else {
            if (!receipt) {
              this._router.navigate(['/errors/403'], { skipLocationChange: true });
            }
          }
        });
      }
      return true;
  }

  /**
   * Order Query
   * @param orderPid - Order pid
   * @returns Observable
   */
  private _orderQuery(orderPid: string): Observable<boolean> {
    return this._acqOrderApiService.getOrder(orderPid).pipe(
      map((order: any) => order.metadata),
      map((order) => {
        const ref = '$ref';
        const userLocale: IUserLocaleStorage = this._userService.getOnLocaleStorage();
        if (userLocale.currentLibrary !== extractIdOnRef(order.library[ref])) {
          return false;
        }
        return [
          AcqOrderStatus.ORDERED,
          AcqOrderStatus.PARTIALLY_RECEIVED
        ].some((key: string) => key === order.status);
      }),
      catchError(() => of(false))
    );
  }

  /**
   * Receipt Query
   * @param receiptPid - Receipt pid
   * @returns Observable
   */
  private _receiptQuery(receiptPid: string, orderPid: string): Observable<boolean> {
    return this._acqReceiptApiService.getReceipt(receiptPid).pipe(
      map((receipt: IReceiptOrder) => {
        return orderPid === extractIdOnRef(receipt.acq_order[this.ref]);
      }),
      catchError(() => of(false))
    );
  }
}
