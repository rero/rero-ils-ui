/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
 * Copyright (C) 2022 UCLouvain
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
import { Component, OnInit } from '@angular/core';
import { IRolePermission, PermissionApiService } from '../../../api/permission-api.service';

@Component({
  selector: 'admin-permission-detail-view',
  templateUrl: './permission-detail-view.component.html',
  styleUrls: ['./permission-detail-view.component.scss'],
})
export class PermissionDetailViewComponent implements OnInit {

  /** All available roles */
  roles: string[];

  /** All available permissions */
  permissions: string[];

  /** Filtered permissions */
  filteredPermissions: string[];

  /** All permissions regrouped by roles */
  permissionsByRoles: { [key: string]: any };

  /**
   * Constructor
   * @param _permissionApiService - PermissionApiService
   */
  constructor(private _permissionApiService: PermissionApiService) { }

  /** On init hook */
  ngOnInit(): void {
    this._permissionApiService.getAllPermissionsByRole().subscribe((permissionsByRoles: IRolePermission) => {
      this.roles = Object.keys(permissionsByRoles);
      this.permissions = Object.keys(permissionsByRoles[this.roles[0]]);
      this.permissionsByRoles = permissionsByRoles;
      this.filteredPermissions = [ ...this.permissions ];
    });
  }

  /**
   * Filtering of the list according to the user's input in the input field.
   *
   * @param value - value text
   */
  filterPermissions(value: string): void {
    this.filteredPermissions = this.permissions.filter((permission: string) => permission.includes(value));
  }
}
