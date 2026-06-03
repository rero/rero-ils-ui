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
import { IPermissions, PERMISSIONS } from '../../../util/permissions';
import { DialogService } from 'primeng/dynamicdialog';
import { OperationLogsComponent } from '../operation-logs.component';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
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
        resourceType: this.resourceType(),
        resourcePid: this.resourcePid()
      }
    });
  }
}
