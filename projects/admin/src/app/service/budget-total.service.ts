/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetTotalService {

  /**
   * Observable: On total changed
   */
  onTotalChanged$: BehaviorSubject<number> = new BehaviorSubject(0);

  /**
   * Budget Total
   */
  private _budgetTotal = 0;

  /**
   * Total
   * @return number
   */
  getTotal(): number {
    return this._budgetTotal;
  }

  /**
   * Add amount
   * @param amount - number
   * @return this
   */
  addAmount(amount: number): this {
    this._budgetTotal = this._budgetTotal + amount;
    this.onTotalChanged$.next(this._budgetTotal);
    return this;
  }

  /**
   * Remove amount
   * @param amount - number
   */
  removeAmount(amount: number) {
    this._budgetTotal = this._budgetTotal - amount;
    this.onTotalChanged$.next(this._budgetTotal);
  }

  /**
   * Reset
   * Set the total to 0
   */
  reset() {
    this._budgetTotal = 0;
    this.onTotalChanged$.next(0);
  }
}
