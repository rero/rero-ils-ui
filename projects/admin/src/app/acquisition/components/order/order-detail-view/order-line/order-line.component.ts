/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { forkJoin } from 'rxjs';
import { AcqOrderApiService } from '../../../../api/acq-order-api.service';
import { AcqNote, AcqNoteType, AcqOrderLine } from '../../../../classes/order';

@Component({
  selector: 'admin-order-line',
  templateUrl: './order-line.component.html',
  styleUrls: ['./order-line.component.scss']
})
export class OrderLineComponent implements OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** order line */
  @Input() orderLine: AcqOrderLine;
  /** parent order */
  @Input() order: any;

  /** order line permission */
  permissions: any;
  /** order line relate account */
  account: any;
  /** Is the line is collapsed */
  isCollapsed = true;

  // GETTER & SETTER ==========================================================
  /**
   * Get a message containing the reasons why the order line cannot be deleted
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /** Constructor
   * @param _recordPermissionService - RecordPermissionService
   * @param _recordService - RecordService
   * @param _acqOrderApiService - AcqOrderApiService
   */
  constructor(
    private _recordPermissionService: RecordPermissionService,
    private _recordService: RecordService,
    private _acqOrderApiService: AcqOrderApiService,
  ) { }

  /** OnInit hook */
  ngOnInit() {
    const permissions$ = this._recordPermissionService.getPermission('acq_order_lines', this.orderLine.pid);
    const account$ = this._recordService.getRecord('acq_accounts', this.orderLine.acq_account.pid);
    forkJoin([permissions$, account$]).subscribe(
      ([permissions, account]) => {
        this.permissions = permissions;
        this.account = account;
      }
    );
  }

  // COMPONENT FUNCTIONS ======================================================

  /** Delete the order line */
  deleteOrderLine() {
    this._acqOrderApiService.deleteOrderLine(this.orderLine);
  }

  /** Get the color to use for the bullet
   *  @param note - the note to analyze
   */
  getNoteColor(note: AcqNote): string {
    switch (note.type) {
      case AcqNoteType.STAFF_NOTE: return 'info';
      case AcqNoteType.VENDOR_NOTE: return 'warning';
      default: return 'secondary';
    }
  }
}
