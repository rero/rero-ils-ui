// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { IPermissions, PERMISSIONS } from '../../../util/permissions';
import { DialogService } from 'primeng/dynamicdialog';
import { OperationLogsComponent, sortOptionType } from '../operation-logs.component';
import { TranslateService, TranslatePipe, _ } from '@ngx-translate/core';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';
import { PermissionsDirective } from '../../../directive/permissions.directive';

@Component({
  selector: 'shared-operation-logs-dialog',
  templateUrl: './operation-logs-dialog.component.html',
  imports: [Bind, Button, PermissionsDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
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
    { value: 'created', label: _('Date (oldest)'), icon: 'fa fa-sort-amount-asc' }
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
        sortOptions: this.sortOptions()
      }
    });
  }
}
