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
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { RecordService } from '@rero/ng-core';
import { BaseApi } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export abstract class AbstractCanAddGuard {

  protected recordService: RecordService = inject(RecordService);
  protected router: Router = inject(Router);

  /**
   * Allow to access to the resource
   * @param route - Rote
   * @returns  Observable boolean
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    throw new Error('Missing canActivate implementation.');
  }

  /**
   * Allows you to add an item in the current fiscal year
   * @param resource - resource name
   * @param pid - resource pid
   * @returns Observable boolean
   */
  protected canAdd(resource: string, pid: string): Observable<boolean> {
    return this.recordService.getRecord(resource, pid, 0, BaseApi.reroJsonheaders).pipe(
      map((record: any) => record.metadata),
      map((record: any) => {
        if (!('is_current_budget' in record) || !record.is_current_budget) {
          this.router.navigate(['/errors/403'], { skipLocationChange: true });
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/errors/404'], { skipLocationChange: true });
        return of(false);
      })
    );
  }
}
