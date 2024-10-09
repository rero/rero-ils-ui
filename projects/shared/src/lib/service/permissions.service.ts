/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
 * Copyright (C) 2022-2024 UCLouvain
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
import { PERMISSIONS, PERMISSION_OPERATOR } from '../util/permissions';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {

  /** Permissions set */
  protected permissions = new Set<string>();

  /**
   * Set all permissions in set
   * @param permissions - array of permissions
   * @returns this
   */
  setPermissions(permissions: string[]): this {
    permissions.map((permission: string) => {
      if (!this.permissions.has(permission)) {
        this.permissions.add(permission);
      }
    });

    return this;
  }

  /**
   * Can access
   * @param permission - permission or array of permissions
   * @param operator - only or and and
   * @returns true if permission is granted
   */
   canAccess(permission: string | string[], operator: string = PERMISSION_OPERATOR.OR): boolean {
    if (typeof permission === 'string') {
      permission = [permission];
    }

    switch(operator) {
      case PERMISSION_OPERATOR.OR:
        return permission.some((perm: string) => this.permissions.has(perm));
      case PERMISSION_OPERATOR.AND:
        return permission.every((perm: string) => this.permissions.has(perm))
      default:
        throw new Error(
          'Permission operator: The values for the operator is "and" or "or".'
        );
    }
  }

  /**
   * Can access to the debug mode
   * @returns true if the permission is granted
   */
  canAccessDebugMode(): boolean {
    return this.permissions.has(PERMISSIONS.DEBUG_MODE);
  }
}
