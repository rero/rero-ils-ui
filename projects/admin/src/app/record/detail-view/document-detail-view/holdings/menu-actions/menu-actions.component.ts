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
import { Component, computed, effect, inject, input, signal, ChangeDetectionStrategy} from '@angular/core';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppStore, IPermissions, PERMISSIONS, PermissionsDirective } from '@rero/shared';
import { EsRecord } from '@rero/shared';
import { forkJoin } from 'rxjs';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';

@Component({
    selector: 'admin-menu-actions',
    templateUrl: './menu-actions.component.html',
    imports: [PermissionsDirective, Bind, Button, TranslatePipe, Menu],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuActionsComponent {

  protected appStore = inject(AppStore);
  protected recordPermissionService = inject(RecordPermissionService);
  protected translateService = inject(TranslateService);

  document = input.required<EsRecord>();

  permissions = signal<[any, any] | null>(null);

  constructor() {
    effect(() => {
      this.document(); // track document changes
      forkJoin([
        this.recordPermissionService.getPermission('holdings'),
        this.recordPermissionService.getPermission('items'),
      ]).subscribe(p => this.permissions.set(p));
    });
  }

  canAdd = computed(() => {
    const p = this.permissions();
    if (!p) return false;

    const [hold, item] = p;
    return hold.create.can || item.create.can;
  });


  protected perms: IPermissions = PERMISSIONS;

  protected options = computed(() => {
    const perms = this.permissions();
    if (!perms) return [];
    return [
        {
          label: this.translateService.instant('an item'),
          routerLink: ['/', 'records', 'items', 'new'],
          queryParams: { document: this.document().metadata.pid },
          visible: this.appStore.canAccess(PERMISSIONS.ITEM_CREATE)
        },
        {
          label: this.translateService.instant('a holdings'),
          routerLink: ['/', 'records', 'holdings', 'new'],
          queryParams: { document: this.document().metadata.pid },
          visible: this.appStore.canAccess(PERMISSIONS.HOLD_CREATE)
        }
      ];
  });
}
