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
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NgClass } from '@angular/common';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';
import { PermissionApiService } from '../../../api/permission-api.service';

type IRole = {
  name: string;
  type: string;
};

@Component({
  selector: 'admin-permission-detail-view',
  templateUrl: './permission-detail-view.component.html',
  standalone: true,
  imports: [TranslateDirective, InputText, NgClass, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionDetailViewComponent {

  private readonly permissionApiService = inject(PermissionApiService);

  readonly globalPermissions = toSignal(
    this.permissionApiService.getAllPermissionsByRole()
  );

  readonly roles = computed<IRole[]>(() => {
    const permissions = this.globalPermissions();
    if (!permissions) return [];
    return Object.keys(permissions)
      .map(roleName => ({ name: roleName, type: permissions[roleName].type }))
      .sort((a, b) =>
        a.type === b.type
          ? a.name.localeCompare(b.name)
          : a.type === 'system_role' ? -1 : 1
      );
  });

  private readonly permissionNames = computed<string[]>(() => {
    const permissions = this.globalPermissions();
    const roles = this.roles();
    if (!permissions || roles.length === 0) return [];
    return Object.keys(permissions[roles[0].name].actions);
  });

  private readonly filterValue = signal('');

  readonly filteredPermissionNames = computed<string[]>(() => {
    const filter = this.filterValue();
    const names = this.permissionNames();
    if (!filter) return names;
    const regexp = new RegExp(filter, 'g');
    return names.filter(name => name.match(regexp));
  });

  roleClass(type: string): string {
    return 'type-' + type.replace('_', '-');
  }

  permissionClass(value: boolean | null): string {
    if (value === true) return 'text-success';
    if (value === false) return 'text-error';
    return 'ui:text-muted-color';
  }

  filterPermissions(value: string): void {
    this.filterValue.set(value);
  }
}
