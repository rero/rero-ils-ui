// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, effect, inject, input, signal, ChangeDetectionStrategy } from '@angular/core';
import { IPatronPermission, PermissionApiService } from '@app/admin/api/permission-api.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { InputText } from 'primeng/inputtext';
import { PatronPermissionComponent } from './patron-permission/patron-permission.component';

@Component({
  selector: 'admin-patron-permissions',
  templateUrl: './patron-permissions.component.html',
  imports: [TranslateDirective, Bind, InputText, PatronPermissionComponent, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatronPermissionsComponent {

  private permissionApiService = inject(PermissionApiService);

  hidden = input(false);
  pid = input.required<string>();

  permissions = signal<IPatronPermission[]>([]);
  filteredPermissions = signal<IPatronPermission[]>([]);

  constructor() {
    effect(() => {
      if (!this.hidden() && this.permissions().length === 0) {
        this.permissionApiService
          .getUserPermissions(this.pid())
          .subscribe((permissions: IPatronPermission[]) => {
            this.permissions.set(permissions);
            this.filteredPermissions.set(permissions);
          });
      }
    });
  }

  filterPermissions(value: string): void {
    this.filteredPermissions.set(
      this.permissions().filter((permission: IPatronPermission) => permission.name.includes(value))
    );
  }
}
