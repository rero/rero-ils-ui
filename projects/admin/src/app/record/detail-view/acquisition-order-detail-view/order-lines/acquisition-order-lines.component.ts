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
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { RecordPermissionMessageService } from '../../../../service/record-permission-message.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'admin-acquisition-order-lines',
  templateUrl: './acquisition-order-lines.component.html'
})
export class AcquisitionOrderLinesComponent {

  /** Acquisition order pid */
  @Input() order: any;

  /** Event for delete order line */
  @Output()
  deleteOrderLine = new EventEmitter();

  /** Acquisition order Line observable */
  @Input()
  orderLines$: Observable<Array<any>>;

  /**
   * Constructor
   * @param recordService - RecordService
   * @param recordUiService - RecordUiService
   * @param recordPermissionMessage - RecordPermissionMessageService
   */
  constructor(
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _recordPermissionMessage: RecordPermissionMessageService
  ) { }

  /**
   * Delete order line
   * @param orderLinePid - AcqOrderLine pid
   */
  delete(orderLinePid: string) {
    this.deleteOrderLine.emit(orderLinePid);
  }

  /**
   * Display message if the record cannot be deleted
   * @param orderLine - AcqOrderLine record
   */
  public showDeleteMessage(orderLine: object) {
    const message = this._recordPermissionMessage.generateMessage(orderLine);
    this._recordUiService.showDeleteMessage(message);
  }
}
