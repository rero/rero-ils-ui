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
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanAccessGuard implements CanActivate {

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _userService - UserService
   * @param _router - Router
   */
  constructor(
    private _recordService: RecordService,
    private _userService: UserService,
    private _router: Router
  ) {}

  /**
   * Can activate
   * @param route - ActivatedRouteSnapshot
   * @returns True if authorized access order redirect to error page 400 or 403
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const params = route.params;
    if (params && params.type && params.pid) {
      return this._recordService.getRecord(params.type, params.pid)
        .pipe(map((record: any) => {
          const user = this._userService.user;
          if (user.currentOrganisation !== extractIdOnRef(record.metadata.organisation.$ref)) {
            /** Access forbidden */
            this._router.navigate(['/errors/403'], { skipLocationChange: true });
            return false;
          }
          return true;
        }));
    } else {
      /** Missing parameter */
      this._router.navigate(['/errors/400'], { skipLocationChange: true });
      return of(false);
    }
  }
}
