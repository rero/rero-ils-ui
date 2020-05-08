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
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';

@Component({
  selector: 'admin-order-line',
  templateUrl: './order-line.component.html',
  styles: []
})
export class OrderLineComponent implements OnInit {

  /** order line */
  @Input() orderLine: any;

  /** parent order */
  @Input() order: any;

  /** order line permission */
  permissions: any;

  /** Event for delete order line */
  @Output() deleteOrderLine = new EventEmitter();

  /**
   * Constructor
   * @param _recordPermissionService - RecordPermissionService
   */
  constructor(
    private _recordPermissionService: RecordPermissionService
  ) { }

  /**
   * On init hook
   */
  ngOnInit() {
    this._recordPermissionService.getPermission('acq_order_lines', this.orderLine.metadata.pid).subscribe(
      (permissions) => this.permissions = permissions
    );
  }

  /**
   * Delete order line
   * @param orderLinePid - AcqOrderLine pid
   */
  delete(orderLinePid: string) {
    this.deleteOrderLine.emit(orderLinePid);
  }

  /**
   * Return a message containing the reasons wht the item cannot be requested
   * @return the message to display into the tooltip box
   */
  get deleteInfoMessage(): string {
    return this._recordPermissionService.generateDeleteMessage(this.permissions.delete.reasons);
  }

}
