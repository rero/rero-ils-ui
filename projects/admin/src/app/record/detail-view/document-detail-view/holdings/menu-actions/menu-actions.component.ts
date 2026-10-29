// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { Menu } from '@openng/optimus-ui/menu';
import { AppStore, EsRecord, IPermissions, PERMISSIONS, PermissionsDirective } from '@rero/shared';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'admin-menu-actions',
  templateUrl: './menu-actions.component.html',
  imports: [PermissionsDirective, Bind, Button, TranslatePipe, Menu],
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
      ]).subscribe((p) => this.permissions.set(p));
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
        visible: this.appStore.canAccess(PERMISSIONS.ITEM_CREATE),
      },
      {
        label: this.translateService.instant('a holdings'),
        routerLink: ['/', 'records', 'holdings', 'new'],
        queryParams: { document: this.document().metadata.pid },
        visible: this.appStore.canAccess(PERMISSIONS.HOLD_CREATE),
      },
    ];
  });
}
