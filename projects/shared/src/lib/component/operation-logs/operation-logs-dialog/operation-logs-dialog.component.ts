// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input } from '@angular/core';
import { _, TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Button } from '@openng/optimus-ui/button';
import { DialogService } from '@openng/optimus-ui/dynamicdialog';

import { PermissionsDirective } from '../../../directive/permissions.directive';
import { IPermissions, PERMISSIONS } from '../../../util/permissions';
import { OperationLogsComponent, sortOptionType } from '../operation-logs.component';

@Component({
  selector: 'shared-operation-logs-dialog',
  templateUrl: './operation-logs-dialog.component.html',
  imports: [Bind, Button, PermissionsDirective, TranslatePipe],
})
export class OperationLogsDialogComponent {
  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);

  /** Resource type */
  readonly resourceType = input<string>();

  /** Resource pid */
  readonly resourcePid = input<string>();

  readonly sortCriteria = input<string>('mostrecent');

  readonly sortOptions = input<sortOptionType[]>([
    { value: 'mostrecent', label: _('Date (newest)'), icon: 'fa fa-sort-amount-desc' },
    { value: 'created', label: _('Date (oldest)'), icon: 'fa fa-sort-amount-asc' },
  ]);

  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;

  /** Open operation logs dialog */
  openDialog(): void {
    this.dialogService.open(OperationLogsComponent, {
      header: this.translateService.instant('Operation history'),
      modal: true,
      closable: true,
      width: '60vw',
      contentStyle: { 'min-height': '10rem' },
      position: 'top',
      data: {
        resourceType: this.resourceType(),
        resourcePid: this.resourcePid(),
        sortCriteria: this.sortCriteria(),
        sortOptions: this.sortOptions(),
      },
    });
  }
}
