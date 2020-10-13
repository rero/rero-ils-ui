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
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../service/user.service';


@Injectable({
  providedIn: 'root'
})
export class ItemAccessGuard implements CanActivate {

  /**
   * Constructor
   * @param _router - Router
   * @param _userService - UserService
   * @param _recordService - RecordService
   * @param _toastr - ToastrService
   * @param _translateService - TranslateService
   */
  constructor(
    private _router: Router,
    private _userService: UserService,
    private _recordService: RecordService,
    private _toastr: ToastrService,
    private _translateService: TranslateService
  ) {}

  /**
   * Item Access control
   * @param next - ActivatedRouteSnapshot
   * @param state - RouterStateSnapshot
   * @return boolean
   */
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const itemPid = next.params.pid;
      this._recordService.getRecord('items', itemPid).pipe(
        map((data: any) => data.metadata),
        map(data => extractIdOnRef(data.holding.$ref))
      )
      .subscribe(holdingPid => {
        const query = `pid:${holdingPid}`;
        this._recordService.getRecords('holdings', query, 1, 1).pipe(
          map((result: Record) => this._recordService.totalHits(result.hits.total) === 0
            ? null
            : result.hits.hits[0]
          ),
        ).subscribe(data => {
          if (null === data) {
            this._toastr.warning(
              this._translateService.instant('Access denied'),
              this._translateService.instant('item')
            );
            // Redirect to homepage
            this._router.navigate(['/']);
          }
          const userCurrentLibrary = this._userService.getCurrentUser().currentLibrary;
          if (userCurrentLibrary !== data.metadata.library.pid) {
            this._toastr.warning(
              this._translateService.instant('Access denied'),
              this._translateService.instant('item')
            );
            // Redirect to homepage
            this._router.navigate(['/']);
          }
        });
      },
        () => {
          this._toastr.warning(
            this._translateService.instant('Item not found'),
            this._translateService.instant('item')
          );
          // Redirect to homepage on error
          this._router.navigate(['/']);
        }
      );
      return true;
  }
}
