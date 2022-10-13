/*
 * RERO ILS UI
 * Copyright (C) 2019-2022 RERO
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

import { Component, Input } from '@angular/core';
import { ResultItem } from '@rero/ng-core';
import { PERMISSIONS, PermissionsService } from '@rero/shared';

@Component({
  selector: 'admin-patrons-brief-view',
  templateUrl: './patrons-brief-view.component.html',
  styleUrls: ['./patrons-brief-view.component.scss']
})
export class PatronsBriefViewComponent implements ResultItem {

  /** the record to display */
  @Input() record: any;
  /** the record type */
  @Input() type: string;
  /** the url to access detail view */
  @Input() detailUrl: { link: string, external: boolean };

  /** mapping to define role badge color */
  private _rolesBadgeMappings = {
    patron: 'badge-primary',
    pro_full_permissions: 'badge-success',
    pro_read_only: 'badge-secondary',
    pro_catalog_manager: 'badge-danger',
    pro_circulation_manager: 'badge-warning',
    pro_user_manager: 'badge-info',
    pro_acquisition_manager: 'badge-light',
    pro_library_administrator: 'badge-dark',
  };

  /**
   * Circulation access check
   * @return true if the circulation permission is allowed
   */
   get circulationAccess(): boolean {
    return this._permissionsService.canAccess(PERMISSIONS.CIRC_ADMIN);
  }

  /**
   * Constructor
   * @param _permissionsService - PermissionsService
   */
  constructor(private _permissionsService: PermissionsService) {}

  /**
   * Get the color badge to apply for a specific role
   * @param role: the role to check.
   * @return the bootstrap badge class to use for this role.
   */
  getRoleBadgeColor(role: string): string {
    return (role in this._rolesBadgeMappings)
      ? this._rolesBadgeMappings[role]
      : 'badge-light';
  }
}
