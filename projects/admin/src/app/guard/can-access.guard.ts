/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordPermissions } from '../classes/permissions';
import { RecordPermissionService } from '../service/record-permission.service';

@Injectable({
  providedIn: 'root'
})
export class CanAccessGuard  {

  private permissionService: RecordPermissionService = inject(RecordPermissionService);
  private router: Router = inject(Router);

  private _mandatoryParams = [
    'type',
    'pid'
  ];

  /**
   * Can activate
   * @param route - ActivatedRouteSnapshot
   * @returns True if granted or redirect to error page 400/403
   */
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // Check if the action entry is in route data
    if (
      !('action' in route.data)
      || !(Object.values(CAN_ACCESS_ACTIONS).includes(route.data.action))
      || !(this._mandatoryParams.every((param: string) => param in route.params))
    ) {
      this.router.navigate(['/errors/400'], { skipLocationChange: true });
      return of(false);
    }

    return this.permissionService.getPermission(route.params.type, route.params.pid).pipe(
      map((permission: RecordPermissions) => {
        if (!permission[route.data.action].can) {
          this.router.navigate(['/errors/403'], { skipLocationChange: true });
          return false;
        }
        return true;
      })
    );
  }
}

export const CAN_ACCESS_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete',
  LIST: 'list',
  READ: 'read',
  UPDATE: 'update'
}
