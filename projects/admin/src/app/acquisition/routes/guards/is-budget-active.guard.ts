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
import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsBudgetActiveGuard  {

  private recordService: RecordService = inject(RecordService);
  private router: Router = inject(Router);

  /**
   * Can activate
   * @param route - ActivatedRouteSnapshot
   * @returns Observable boolean
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const {type, pid} = route.params;
    if (!type || !pid) {
      return of(false);
    }
    return this.recordService.getRecord(type, pid, 0, BaseApi.reroJsonheaders).pipe(
      map(record => ('metadata' in record) ? record.metadata : record),
      map(record => {
        if (!('is_current_budget' in record) || !record.is_current_budget) {
          this.router.navigate(['/errors/403'], { skipLocationChange: true });
          return false;
        }
        return true;
      })
    );
  }
}
