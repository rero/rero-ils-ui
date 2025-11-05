/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { Component, computed, inject, input, resource } from '@angular/core';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { IPermissions, PERMISSIONS, PermissionsService } from '@rero/shared';
import { EsRecord } from 'projects/shared/src/public-api';
import { firstValueFrom, forkJoin } from 'rxjs';

@Component({
  selector: 'admin-menu-actions',
  standalone: false,
  templateUrl: './menu-actions.component.html'
})
export class MenuActionsComponent {

  protected permissionsService = inject(PermissionsService);
  protected recordPermissionService = inject(RecordPermissionService);
  protected translateService = inject(TranslateService);

  document = input.required<EsRecord>();

  permissions = resource({
    request: () => this.document(),
    loader: () =>
      firstValueFrom(
        forkJoin([
          this.recordPermissionService.getPermission('holdings'),
          this.recordPermissionService.getPermission('items'),
        ])
      )
  });

  canAdd = computed(() => {
    const p = this.permissions.value();
    if (!p) return false;

    const [hold, item] = p;
    return hold.create.can || item.create.can;
  });


  protected perms: IPermissions = PERMISSIONS;

  protected options = computed(() => {
    const perms = this.permissions.value();
    if (!perms) return [];
    return [
        {
          label: this.translateService.instant('an item'),
          routerLink: ['/', 'records', 'items', 'new'],
          queryParams: { document: this.document().metadata.pid },
          visible: this.permissionsService.canAccess(PERMISSIONS.ITEM_CREATE)
        },
        {
          label: this.translateService.instant('a holdings'),
          routerLink: ['/', 'records', 'holdings', 'new'],
          queryParams: { document: this.document().metadata.pid },
          visible: this.permissionsService.canAccess(PERMISSIONS.HOLD_CREATE)
        }
      ];
  });
}
