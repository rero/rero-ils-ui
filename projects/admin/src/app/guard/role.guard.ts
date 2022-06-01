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
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { UserService } from '@rero/shared';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/** This guards check if the current logged user has a specific role. The roles to check should be passed
 *  using path.data.roles (see below). You can provide multiple roles ; the guards check if the user has at
 *  least one of this role (OR condition).
 *
 *  USAGE:
 *  { path: 'new',
 *    component: MyComponent,
 *    canActivate: [RoleGuard],
 *    data: {
 *      roles: ['xxx', 'yyy'],
 *      operator: 'and' || 'or'  # 'and' by default
 *    }
 *  }
 */
export class RoleGuard implements CanActivate {

  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  /** Check if the current logged user as at least a specific role */
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    if (!this._userService.user.hasRoles(next.data.roles as Array<string>, next.data.operator || 'and')) {
      this._router.navigate(['/errors/403'], { skipLocationChange: true });
      return of(false);
    }
    return of(true);
  }

}
