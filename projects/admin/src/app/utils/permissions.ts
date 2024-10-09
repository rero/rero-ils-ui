/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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
import { UserService } from '@rero/shared';
import { RecordPermission, RecordPermissions } from '../classes/permissions';

@Injectable()
export class CurrentLibraryPermissionValidator {

  private userService: UserService = inject(UserService);

  /**
   * Update the permissions analyzing the current library. If the library isn't
   * The same than the object, then all updates operation should be disabled.
   * @param permissions: the permissions related to the object.
   * @param ownerLibraryPid: the related object owner library pid.
   */
  validate(permissions: RecordPermissions, ownerLibraryPid: string){
    if (this.userService.user.currentLibrary !== ownerLibraryPid) {
      const disabledPermission: RecordPermission = {
        can: false,
        reasons: {
          others: {
            record_not_in_current_library: ''
          }
        }
      };
      permissions.create = disabledPermission;
      permissions.delete = disabledPermission;
      permissions.update = disabledPermission;
    }
    return permissions;
  }
}
