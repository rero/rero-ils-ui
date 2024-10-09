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
import { IPermissions, PERMISSIONS } from '@rero/shared';
import { DialogService } from 'primeng/dynamicdialog';
import { OperationLogsComponent } from '../operation-logs.component';

@Component({
  selector: 'admin-operation-logs-dialog',
  templateUrl: './operation-logs-dialog.component.html'
})
export class OperationLogsDialogComponent {

  private dialogService: DialogService = inject(DialogService);

  /** Resource type */
  @Input() resourceType: string;

  /** Resource pid */
  @Input() resourcePid: string;

  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;

  /** Open operation logs dialog */
  openDialog(): void {
    this.dialogService.open(OperationLogsComponent, {
      dismissableMask: true,
      data: {
        resourceType: this.resourceType,
        resourcePid: this.resourcePid
      }
    });
  }
}
