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
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { RecordService } from '@rero/ng-core';
import { map, switchMap } from 'rxjs/operators';
import { MainTitleService } from '../../../service/main-title.service';

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
    private _recordService: RecordService,
    private _mainTitleService: MainTitleService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this.documents$ = this.record$.pipe(
      switchMap(record => {
        const personPid = record.metadata.pid;
        const query = `authors.pid:${personPid}`;
        return this._recordService.getRecords(
        'documents', query, 1, RecordService.MAX_REST_RESULTS_SIZE
      ); }),
      map(hits => hits.hits.total === 0 ? [] : hits.hits.hits)
    );
  }

  /**
   * Get main title (correspondig to 'bf_Title' type, present only once in metadata)
   * @param titleMetadata: title metadata
   */
  getMainTitle(titleMetadata: any): string {
    return this._mainTitleService.getMainTitle(titleMetadata);
  }
}
