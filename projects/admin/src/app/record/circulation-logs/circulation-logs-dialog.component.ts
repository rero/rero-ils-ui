// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { IPermissions, PERMISSION_OPERATOR, PERMISSIONS, PermissionsDirective } from '@rero/shared';
import { DialogService } from 'primeng/dynamicdialog';
import { CirculationLogsComponent } from './circulation-logs.component';
import { Bind } from 'primeng/bind';
import { Button } from 'primeng/button';

@Component({
    selector: 'admin-circulation-logs-dialog',
    template: `
    <p-button
      icon="fa-solid fa-clock-rotate-left"
      id="{{ resourceType() }}-circulation-history"
      [label]="'Circulation history'|translate"
      outlined
      severity="secondary"
      [permissions]="[permissions.CIRC_ADMIN, permissions.OPLG_SEARCH]"
      [operator] = permissionOperator.AND
      (onClick)="openDialog()"
    />
  `,
    imports: [Bind, Button, PermissionsDirective, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CirculationLogsDialogComponent {

  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);
  // COMPONENT ATTRIBUTES =====================================================
  /** Resource pid */
  resourcePid = input<string>();
  /** Resource type */
  resourceType = input('item');

  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;

  /** Available operators for permissions */
  permissionOperator = PERMISSION_OPERATOR;

  // COMPONENT FUNCTIONS ======================================================
  /** Open operation logs dialog */
  openDialog(): void {
    this.dialogService.open(CirculationLogsComponent, {
      header: this.translateService.instant('Circulation history'),
      modal: true,
      closable: true,
      width: '60vw',
      position: 'top',
      data: {
        resourceType: this.resourceType(),
        resourcePid: this.resourcePid()
      }
    });
  }
}
