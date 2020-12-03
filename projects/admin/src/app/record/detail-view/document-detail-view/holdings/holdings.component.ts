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
import { RecordPermissionService } from 'projects/admin/src/app/service/record-permission.service';
import { forkJoin } from 'rxjs';
import { UserService } from '@rero/shared';

@Component({
  selector: 'admin-holdings',
  templateUrl: './holdings.component.html'
})
export class HoldingsComponent implements OnInit {
  /** Document pid */
  @Input() documentPid: string;

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
    private _recordUiService: RecordUiService,
    private _recordPermissionService: RecordPermissionService
  ) { }

  /** Init */
  ngOnInit() {
    const orgPid = this._userService.user.currentOrganisation;
    const query = `document.pid:${this.documentPid} AND organisation.pid:${orgPid}`;
    const holdingRecordsRef = this._recordService.getRecords(
      'holdings',
      query,
      1,
      RecordService.MAX_REST_RESULTS_SIZE,
      undefined,
      undefined,
      undefined,
      'library_location'
    );
    const permissionsRef = this._recordPermissionService.getPermission('holdings');
    forkJoin([holdingRecordsRef, permissionsRef]).subscribe(
      (result: [Record, any]) => {
        const holdingsData = result[0];
        const permissions = result[1];
        if (this._recordService.totalHits(holdingsData.hits.total) > 0) {
          this.holdings = holdingsData.hits.hits;
        }
        this.canAdd = permissions.create.can;
      }
    );
  }

  /** Delete a given holding.
   *
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
