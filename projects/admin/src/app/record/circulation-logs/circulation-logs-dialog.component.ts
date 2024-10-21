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
import { Component, inject, Input } from '@angular/core';
import { IPermissions, PERMISSION_OPERATOR, PERMISSIONS } from '@rero/shared';
import { DialogService } from 'primeng/dynamicdialog';
import { CirculationLogsComponent } from './circulation-logs.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-circulation-logs-dialog',
  template: `
    <div class="w-100 text-right">
      <button
        id="item-circulation-history"
        class="btn btn-sm btn-outline-secondary my-1"
        [permissions]="[permissions.CIRC_ADMIN, permissions.OPLG_SEARCH]"
        [operator] = permissionOperator.AND
        (click)="openDialog()"
      >
        <i class="fa fa-history"></i>
        {{ 'Circulation history' | translate }}
      </button>
  </div>
  `
})
export class CirculationLogsDialogComponent {

  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource pid */
  @Input() resourcePid: string;
  /** Resource type */
  @Input() resourceType: 'item'|'loan' = 'item';

  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;

  /** Available operators for permissions */
  permissionOperator = PERMISSION_OPERATOR;

  // COMPONENT FUNCTIONS ======================================================
  /** Open operation logs dialog */
  openDialog(): void {
    this.dialogService.open(CirculationLogsComponent, {
      header: this.translateService.instant('Circulation history'),
      dismissableMask: true,
      width: '60vw',
      data: {
        resourcePid: this.resourcePid,
        resourceType: this.resourceType
      }
    });
  }
}
