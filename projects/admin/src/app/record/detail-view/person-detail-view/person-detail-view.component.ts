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
import { Component, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Record } from '@rero/ng-core/lib/record/record';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-person-detail-view',
  templateUrl: './person-detail-view.component.html',
  styles: []
})
export class PersonDetailViewComponent implements DetailRecord, OnInit {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** Documents for current person */
  documents$: Observable<Array<any>>;

  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(
    private _recordService: RecordService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this.documents$ = this.record$.pipe(
      switchMap((record: any) => {
        const personPid = record.metadata.pid;
        const query = `contribution.agent.pid:${personPid}`;
        return this._recordService.getRecords(
        'documents', query, 1, RecordService.MAX_REST_RESULTS_SIZE
      ); }),
      map((hits: Record) => hits.hits.total === 0 ? [] : hits.hits.hits)
    );
  }
}
