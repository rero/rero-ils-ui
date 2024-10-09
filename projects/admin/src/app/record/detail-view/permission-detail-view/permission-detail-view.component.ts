/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { Component, inject, OnInit } from '@angular/core';
import { IRolePermission, PermissionApiService } from '../../../api/permission-api.service';

@Component({
  selector: 'admin-permission-detail-view',
  templateUrl: './permission-detail-view.component.html',
  styleUrls: ['./permission-detail-view.component.scss'],
})
export class PermissionDetailViewComponent implements OnInit {

  private permissionApiService: PermissionApiService = inject(PermissionApiService);

  // COMPONENT ATTRIBUTES =====================================================
  /** All available roles */
  roles: {name: string, type:string}[] = [];
  /** All available permissions */
  permissionNames: string[];
  /** Filtered permissions */
  filteredPermissionNames: string[];
  /** All permissions regrouped by roles */
  globalPermissions: { [key: string]: any };

  /** OnInit hook */
  ngOnInit(): void {
    this.permissionApiService
      .getAllPermissionsByRole()
      .subscribe((permissions: IRolePermission) => {
        this.roles = [];  // reset the roles;
        Object.keys(permissions).map(roleName => this.roles.push({name: roleName, type: permissions[roleName].type}));
        this.roles.sort((role1, role2) => {
          return (role1.type == role2.type)
            ? role1.name.localeCompare(role2.name)
            : (role1.type == 'system_role') ? -1 : 1;
        });

        this.permissionNames = Object.keys(permissions[this.roles[0].name].actions);
        this.globalPermissions = permissions;
        this.filteredPermissionNames = [ ...this.permissionNames ];
      });
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Filter the permission list based on permission name.
   * @param value - string: a regular expression used to filter the permission list.
   */
  filterPermissions(value: string): void {
    const regexp = RegExp(value, 'g');
    this.filteredPermissionNames = this.permissionNames.filter((name: string) => name.match(regexp));
  }

}
