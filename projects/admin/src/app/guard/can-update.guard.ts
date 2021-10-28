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
import { Observable } from 'rxjs';
import { RecordPermissions } from '../classes/permissions';
import { RecordPermissionService } from '../service/record-permission.service';

@Injectable({
  providedIn: 'root'
})
export class CanUpdateGuard implements CanActivate {

  /**
   * Constructor
   * @param _permissionService - RecordPermissionService
   * @param _router - Router
   */
  constructor(
    private _permissionService: RecordPermissionService,
    private _router: Router) {
  }

  /**
   * Check if the current logged user can update a resource
   * @param next - ActivatedRouteSnapshot
   * @param state - RouterStateSnapshot
   */
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this._permissionService.getPermission(next.params.type, next.params.pid).subscribe(
      (permission: RecordPermissions) => {
        if (!permission.update.can) {
          this._router.navigate(['/errors/403'], { skipLocationChange: true });
        }
      }
    );
    return true;
  }
}
