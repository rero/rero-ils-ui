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
import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslateService } from '@ngx-translate/core';
import { IPermissions, PERMISSIONS, PermissionsService } from '@rero/shared';
import { EsRecord } from 'projects/shared/src/public-api';
import { forkJoin, Subscription } from 'rxjs';

@Component({
  selector: 'admin-menu-actions',
  standalone: false,
  templateUrl: './menu-actions.component.html'
})
export class MenuActionsComponent implements OnInit, OnDestroy {

  protected permissionsService = inject(PermissionsService);
  protected recordPermissionService = inject(RecordPermissionService);
  protected translateService = inject(TranslateService);

  document = input.required<EsRecord>();

  protected permissions: IPermissions = PERMISSIONS;
  protected options = signal([]);
  protected canAdd = signal(false);

  private subscription = new Subscription();

  ngOnInit(): void {
    const holdPermissionsObs = this.recordPermissionService.getPermission('holdings');
    const itemPermissionsObs = this.recordPermissionService.getPermission('items');
    forkJoin([holdPermissionsObs, itemPermissionsObs]).subscribe(([holdPerm, itemPerm]) => {
      this.canAdd.set((holdPerm.create.can || itemPerm.create.can));
      this.options.set([
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
      ]);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
