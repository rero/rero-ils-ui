/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { Component, Input, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-holding-item-in-collection',
  templateUrl: './holding-item-in-collection.component.html'
})
export class HoldingItemInCollectionComponent implements OnInit {

  /** Item pid */
  @Input() itemPid: string;
  /** CSS Class for div element */
  @Input() class: string;

  /** Collections */
  collections: [];

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(
    private _recordService: RecordService
  ) { }

  /** OnInit hook */
  ngOnInit() {
    this.isItemInCollection(this.itemPid);
  }

  /**
   * Is this item in a collection
   * @param itemPid - string, pid for item
   */
  private isItemInCollection(itemPid: string) {
    this._recordService.getRecords(
      'collections',
      `items.pid:${itemPid} AND published:true`,
      1,
      RecordService.MAX_REST_RESULTS_SIZE,
      undefined,
      undefined,
      undefined,
      'title'
    ).pipe(
      map((result: any) => {
        return (this._recordService.totalHits(result.hits.total) === 0)
          ? []
          : result.hits.hits;
      })
    ).subscribe(collections => this.collections = collections);
  }
}
