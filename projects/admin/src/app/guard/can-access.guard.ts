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
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { IUserLocaleStorage, UserService } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanAccessGuard implements CanActivate {

  constructor(
    private _recordService: RecordService,
    private _userService: UserService,
    private _router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const params = route.params;
    if (params && params.hasOwnProperty('type') && params.hasOwnProperty('pid')) {
      const userLocale: IUserLocaleStorage = this._userService.getOnLocaleStorage();
      if (userLocale) {
        this._recordService.getRecord(params.type, params.pid)
          .pipe(map((record: any) => record.metadata))
          .subscribe((record: any) => {
            /** The record does not belong to the user's organization. */
            if (userLocale.currentOrganisation !== extractIdOnRef(record.organisation.$ref)) {
              /** Access forbidden */
              this._router.navigate(['/errors/403'], { skipLocationChange: true });
            }
          });
      } else {
        this._router.navigate(['/errors/400'], { skipLocationChange: true });
      }
    } else {
      this._router.navigate(['/errors/400'], { skipLocationChange: true });
    }
    return true;
  }
}
