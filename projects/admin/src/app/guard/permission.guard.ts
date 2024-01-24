/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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
import { PermissionsService, PERMISSION_OPERATOR } from '@rero/shared';
import { Observable, of } from 'rxjs';

/**
 * This guards check if the current logged user has a specific permission. The permission to check should be passed
 * using data.permissions (see below). You can provide multiple permissions;
 *
 * Available values for operator: and, or
 *
 * USAGE:
 * { path: 'new',
 *   component: MyComponent,
 *   canActivate: [PermissionGuard],
 *   data: {
 *     permissions: ['xxx', 'yyy'],
 *     operator: 'and'
 *   }
 * }
 */

 @Injectable({
  providedIn: 'root'
})
export class PermissionGuard  {

  /**
   * Constructor
   * @param _permissionService - PermissionsService
   * @param _router - Router
   */
  constructor(
    private _permissionService: PermissionsService,
    private _router: Router,
  ) { }

  /**
   * Can activate
   * @param route - ActivatedRouteSnapshot
   * @returns True if the permission(s) is granted
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const permissions = 'permissions' in route.data ? route.data.permissions : [];
    const operator = 'operator' in route.data ? route.data.operator : PERMISSION_OPERATOR.OR;
    if (!this._permissionService.canAccess(permissions, operator)) {
      this._router.navigate(['/errors/403'], { skipLocationChange: true });

      return of(false);
    }

    return of(true);
  }
}
