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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-acquisition-order-line-detail-view',
  templateUrl: './acquisition-order-line-detail-view.component.html'
})
export class AcquisitionOrderLineDetailViewComponent implements OnInit, DetailRecord, OnDestroy {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Record subscription */
  private _recordObs: Subscription;

  /** Resource type */
  type: string;

  /** Observable resolving Acquisition order record */
  order$: Observable<any>;

  /**
   * Constructor
   * @param recordService RecordService
   */
  constructor(
    private _recordService: RecordService
  ) { }

  /** On init hook */
  ngOnInit() {
    this._recordObs = this.record$.subscribe(record => {
      // get order record
      this.order$ = this._recordService.getRecord('acq_orders', record.metadata.acq_order.pid).pipe(
        map(order => order));
    });
  }

  /**
   * Destroy
   */
  ngOnDestroy(): void {
    this._recordObs.unsubscribe();
  }
}
