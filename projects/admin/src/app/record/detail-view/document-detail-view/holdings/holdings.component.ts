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

import { Component, Input, OnInit } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { UserService } from '@rero/shared';

@Component({
  selector: 'admin-holdings',
  templateUrl: './holdings.component.html'
})
export class HoldingsComponent implements OnInit {
  /** Document */
  @Input() document: any;

  /** Holdings */
  holdings: Array<any>;

  /** Holding type related to the parent document. */
  @Input() holdingType: 'electronic' | 'serial' | 'standard';

  /** Can a new holding be added? */
  canAdd = false;

  /**
   * Constructor
   * @param _userService - UserService
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   */
  constructor(
    private _userService: UserService,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService
  ) { }

  /** onInit hook */
  ngOnInit() {
    this.canAdd = (!('harvested' in this.document.metadata));
    const orgPid = this._userService.user.currentOrganisation;
    const query = `document.pid:${this.document.metadata.pid} AND organisation.pid:${orgPid}`;
    this._recordService.getRecords(
      'holdings',
      query,
      1,
      RecordService.MAX_REST_RESULTS_SIZE,
      undefined,
      undefined,
      undefined,
      'library_location'
    )
    .subscribe((response: Record) => {
      if (this._recordService.totalHits(response.hits.total) > 0) {
        this.holdings = response.hits.hits;
      }
    });
  }

  /**
   * Delete a given holding.
   * @param data: object with 2 keys :
   *          * 'holding' : the holding to delete
   *          * 'callBakend' : boolean if backend API should be called
   */
  deleteHolding(data: { holding: any, callBackend: boolean }) {
    const holding = data.holding;
    if (data.callBackend === false) {
      this.holdings = this.holdings.filter(
        h => h.metadata.pid !== holding.metadata.pid
      );
    } else {
      this._recordUiService.deleteRecord('holdings', holding.metadata.pid)
        .subscribe((success: any) => {
          if (success) {
            this.holdings = this.holdings.filter(
              h => h.metadata.pid !== holding.metadata.pid
            );
          }
        });
    }
  }
}
