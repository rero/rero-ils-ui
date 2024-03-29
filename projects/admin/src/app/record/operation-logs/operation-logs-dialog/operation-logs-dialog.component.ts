/*
 * RERO ILS UI
 * Copyright (C) 2021-2022 RERO
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
import { Component, Input } from '@angular/core';
import { IPermissions, PERMISSIONS } from '@rero/shared';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { OperationLogsComponent } from '../operation-logs.component';

@Component({
  selector: 'admin-operation-logs-dialog',
  templateUrl: './operation-logs-dialog.component.html'
})
export class OperationLogsDialogComponent {

  /** Resource type */
  @Input() resourceType: string;

  /** Resource pid */
  @Input() resourcePid: string;

  /** Modal ref */
  bsModalRef: BsModalRef;

  /** return all permissions */
  permissions: IPermissions = PERMISSIONS;

  /**
   * Constructor
   * @param modalService - BsModalService
   */
  constructor(private modalService: BsModalService) {}

  /** Open operation logs dialog */
  openDialog(): void {
    const config = {
      ignoreBackdropClick: false,
      keyboard: true,
      initialState: {
        resourceType: this.resourceType,
        resourcePid: this.resourcePid
      }
    };
    this.bsModalRef = this.modalService.show(OperationLogsComponent, config);
    this.bsModalRef.content.dialogClose$.subscribe((value: boolean) => {
      if (value) {
        this.bsModalRef.hide();
      }
    });
  }
}
