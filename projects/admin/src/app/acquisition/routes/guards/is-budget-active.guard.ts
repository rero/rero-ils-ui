/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
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
import { RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Guard that blocks access to a record whose budget is no longer active.
 * Requires route params `type` and `pid`. Redirects to /errors/403 if inactive.
 */
export const isBudgetActiveGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const recordService = inject(RecordService);
  const router = inject(Router);

  const { type, pid } = route.params;
  if (!type || !pid) {
    return of(false);
  }

  return recordService.getRecord(type, pid, { resolve: 0, headers: BaseApi.reroJsonheaders }).pipe(
    map(record => ('metadata' in record) ? record.metadata : record),
    map((record: any) => {
      if (!record.is_current_budget) {
        router.navigate(['/errors/403'], { skipLocationChange: true });
        return false;
      }
      return true;
    })
  );
};
