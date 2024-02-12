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
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RecordService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { AbstractCanAddGuard } from './abstract-can-add.guard';

@Injectable({
  providedIn: 'root'
})
export class CanAddAccountGuard extends AbstractCanAddGuard  {

  /**
   * Constructor
   * @param recordService - RecordService
   * @param router - Router
   */
   constructor(
    recordService: RecordService,
    router: Router
  ) {
    super(recordService, router);
  }

  /**
   * Allow the loading if the budget pid is present and check
   * if the record is in current fiscal year
   * @param route - ActivatedRouteSnapshot
   * @returns Observable boolean
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const budgetPid = route.queryParams.budget;
    if (!budgetPid) {
      this.router.navigate(['/errors/400'], { skipLocationChange: true });
      return of(false);
    }
    return this.canAdd('budgets', budgetPid);
  }
}
