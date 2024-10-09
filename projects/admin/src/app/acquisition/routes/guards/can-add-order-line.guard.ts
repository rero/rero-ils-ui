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
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AbstractCanAddGuard } from './abstract-can-add.guard';

@Injectable({
  providedIn: 'root'
})
export class CanAddOrderLineGuard extends AbstractCanAddGuard  {

  /**
   * Allow the loading if the order pid is present and check
   * if the record is in current fiscal year
   * @param route - ActivatedRouteSnapshot
   * @returns Observable boolean
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const orderPid = route.queryParams.order;
    if (!orderPid) {
      this.router.navigate(['/errors/400'], { skipLocationChange: true });
      return of(false);
    }
    return this.canAdd('acq_orders', orderPid);
  }
}
