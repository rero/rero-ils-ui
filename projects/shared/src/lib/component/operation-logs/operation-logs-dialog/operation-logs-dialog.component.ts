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
import { IPermissions, PERMISSIONS } from '../../../util/permissions';
import { DialogService } from 'primeng/dynamicdialog';
import { OperationLogsComponent } from '../operation-logs.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'shared-operation-logs-dialog',
    templateUrl: './operation-logs-dialog.component.html',
    standalone: false
})
export class OperationLogsDialogComponent {

  private dialogService: DialogService = inject(DialogService);
  private translateService: TranslateService = inject(TranslateService);

  /** Resource type */
  @Input() resourceType: string;

  /** Resource pid */
  @Input() resourcePid: string;

  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;

  /** Open operation logs dialog */
  openDialog(): void {
    this.dialogService.open(OperationLogsComponent, {
      header: this.translateService.instant('Operation history'),
      modal: true,
      closable: true,
      width: '60vw',
      position: 'top',
      data: {
        resourceType: this.resourceType,
        resourcePid: this.resourcePid
      }
    });
  }
}
