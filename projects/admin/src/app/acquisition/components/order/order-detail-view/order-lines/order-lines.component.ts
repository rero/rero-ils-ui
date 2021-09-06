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
import { RecordService, RecordUiService } from '@rero/ng-core';
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { Observable } from 'rxjs';
import { AcqOrder, AcqOrderLine } from '../../../../classes/order';

@Component({
  selector: 'admin-order-lines',
  templateUrl: './order-lines.component.html'
})
export class OrderLinesComponent implements OnInit {

  // COMPONENTS ATTRIBUTES ====================================================
  /** Acquisition order pid */
  @Input() order: AcqOrder;
  /** Acquisition order Line observable */
  @Input() orderLines$: Observable<Array<any>>;

  /** record permissions */
  permissions: any;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   * @param _recordPermissionService - RecordPermissionService
   */
  constructor(
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService
  ) { }

  /** OnInit hook */
  ngOnInit(): void {
    this._recordPermissionService.getPermission('acq_orders', this.order.pid).subscribe(
      (permissions) => this.permissions = permissions
    );
  }
}
