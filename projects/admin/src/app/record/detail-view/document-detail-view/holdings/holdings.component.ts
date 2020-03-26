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

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { RecordService, RecordUiService } from '@rero/ng-core';
import { UserService } from 'projects/admin/src/app/service/user.service';

@Component({
  selector: 'admin-holdings',
  templateUrl: './holdings.component.html'
})
export class HoldingsComponent implements OnInit, OnDestroy {
  /** Document pid */
  @Input() documentPid: string;

  /** Holding observable reference */
  holdgingsRef: any;

  /** Holdings */
  holdings: Array<any>;

  /** Holding type related to the parent document. */
  @Input() holdingType: 'electronic' | 'serial' | 'standard';

  /** Can a new holding be added? */
  canAdd = false;

  /**
   * Constructor
   * @param userService - UserService
   * @param recordService - RecordService
   */
  constructor(
    private _userService: UserService,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService
  ) { }

  /** Init */
  ngOnInit() {
    this._loadHoldings(this.documentPid);
  }

  /** Destroy */
  ngOnDestroy() {
    this.holdgingsRef.unsubscribe();
  }

  /** Delete a given holding.
   *
   * @param holding - the holding to delete
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

  /**
   * Load holdings by document pid
   * @param documentPid - Document pid
   * @returns void
   */
  private _loadHoldings(documentPid: string) {
    const orgPid = this._userService.getCurrentUser().library.organisation.pid;
    const query = `document.pid:${documentPid} AND organisation.pid:${orgPid}`;
    this.holdgingsRef = this._recordService
      .getRecords('holdings', query, 1, RecordService.MAX_REST_RESULTS_SIZE)
      .subscribe((results: any) => {
        // update permission
        if (
          results &&
          results.permissions &&
          results.permissions.cannot_create
        ) {
          this.canAdd = false;
        } else {
          this.canAdd = true;
        }
        // store holdings localy
        if (results.hits.total > 0) {
          this.holdings = results.hits.hits;
        }
      });
  }
}
