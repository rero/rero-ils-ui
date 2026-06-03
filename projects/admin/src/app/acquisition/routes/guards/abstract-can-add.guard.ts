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
import { Router } from '@angular/router';
import { RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Shared helper: checks that the given resource belongs to the current fiscal year.
 * Must be called synchronously within a functional guard (injection context required).
 * @param resource - record type (e.g. 'budgets', 'acq_orders')
 * @param pid - record pid
 */
export function canAdd(resource: string, pid: string): Observable<boolean> {
  const recordService = inject(RecordService);
  const router = inject(Router);

  return recordService.getRecord(resource, pid, { resolve: 0, headers: BaseApi.reroJsonheaders }).pipe(
    map((record: any) => record.metadata),
    map((record: any) => {
      if (!record.is_current_budget) {
        router.navigate(['/errors/403'], { skipLocationChange: true });
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/errors/404'], { skipLocationChange: true });
      return of(false);
    })
  );
}
