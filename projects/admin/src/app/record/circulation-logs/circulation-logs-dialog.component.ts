/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CirculationLogsComponent } from './circulation-logs.component';

@Component({
  selector: 'admin-circulation-logs-dialog',
  template: `
    <button id="item-circulation-history" class="btn btn-sm btn-light my-2 ml-2" (click)="openDialog()" translate>
      Circulation history
    </button>
  `
})
export class CirculationLogsDialogComponent {

  // COMPONENT ATTRIBUTES =====================================================
  /** Resource pid */
  @Input() resourcePid: string;
  /** Resource type */
  @Input() resourceType: 'item'|'loan' = 'item';

  /** Modal ref */
  bsModalRef: BsModalRef;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _modalService - BsModalService
   */
  constructor(private _modalService: BsModalService) {}

  // COMPONENT FUNCTIONS ======================================================
  /** Open operation logs dialog */
  openDialog(): void {
    const config = {
      ignoreBackdropClick: false,
      keyboard: true,
      initialState: {
        resourcePid: this.resourcePid,
        resourceType: this.resourceType
      }
    };
    this.bsModalRef = this._modalService.show(CirculationLogsComponent, config);
    this.bsModalRef.content.dialogClose$.subscribe((value: boolean) => {
      if (value) {
        this.bsModalRef.hide();
      }
    });
  }
}
