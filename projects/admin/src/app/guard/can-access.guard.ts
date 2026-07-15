// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
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
export const canAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const permissionService = inject(RecordPermissionService);
  const router = inject(Router);

  if (
    !('action' in route.data)
    || !(Object.values(CAN_ACCESS_ACTIONS).includes(route.data.action))
    || !(mandatoryParams.every((param: string) => param in route.params))
  ) {
    return router.createUrlTree(['/errors/400']);
  }

  return permissionService.getPermission(route.params.type, route.params.pid).pipe(
    map((permission: RecordPermissions) => {
      const action = route.data.action as keyof RecordPermissions;
      if (!permission[action]?.can) {
        return router.createUrlTree(['/errors/403']);
      }
      return true;
    })
  );
};
