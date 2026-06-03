/*
 * RERO ILS UI
 * Copyright (C) 2021-2025 RERO
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
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecordPermissions } from '../classes/permissions';
import { RecordPermissionService } from '../service/record-permission.service';

export const CAN_ACCESS_ACTIONS = {
  CREATE: 'create',
  DELETE: 'delete',
  LIST: 'list',
  READ: 'read',
  UPDATE: 'update'
} as const;

const mandatoryParams = ['type', 'pid'];

/**
 * Guard that checks if the current user has read/write/delete access to a specific record.
 * Requires `data.action` (one of CAN_ACCESS_ACTIONS) and route params `type` + `pid`.
 * Redirects to /errors/400 on bad route config, /errors/403 on insufficient permissions.
 */
export const canAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const permissionService = inject(RecordPermissionService);
  const router = inject(Router);

  if (
    !('action' in route.data)
    || !(Object.values(CAN_ACCESS_ACTIONS).includes(route.data.action))
    || !(mandatoryParams.every((param: string) => param in route.params))
  ) {
    router.navigate(['/errors/400'], { skipLocationChange: true });
    return of(false);
  }

  return permissionService.getPermission(route.params.type, route.params.pid).pipe(
    map((permission: RecordPermissions) => {
      const action = route.data.action as keyof RecordPermissions;
      if (!permission[action]?.can) {
        router.navigate(['/errors/403'], { skipLocationChange: true });
        return false;
      }
      return true;
    })
  );
};
