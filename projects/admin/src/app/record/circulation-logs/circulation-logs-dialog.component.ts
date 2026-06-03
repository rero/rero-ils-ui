/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
      icon="fa fa-history"
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
