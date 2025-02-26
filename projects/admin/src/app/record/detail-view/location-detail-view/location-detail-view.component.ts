/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'admin-location-detail-view',
    templateUrl: './location-detail-view.component.html',
    standalone: false
})
export class LocationDetailViewComponent implements OnInit, OnDestroy, DetailRecord {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** Record */
  record: any;

  /** The observer to the record observable */
  private _recordObs: Subscription;

  /** On init hook */
  ngOnInit() {
    this._recordObs = this.record$.subscribe(record => {
      this.record = record;
    });
  }

  /**
   * Destroy
   */
  ngOnDestroy(): void {
    this._recordObs.unsubscribe();
  }
}
