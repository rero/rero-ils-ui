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

import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Record, RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-contribution-detail-view',
  templateUrl: './contribution-detail-view.component.html'
})
export class ContributionDetailViewComponent implements DetailRecord, OnInit {

  /** Observable resolving record data */
  record$;

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
    private _translateService: TranslateService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this.documents$ = this.record$.pipe(
      switchMap((record: any) => {
        const contributionPid = record.metadata.pid;
        const query = `contribution.agent.pid:${contributionPid}`;
        return this._recordService.getRecords(
        'documents', query, 1, RecordService.MAX_REST_RESULTS_SIZE
      ); }),
      map((hits: Record) => this._recordService.totalHits(hits.hits.total) === 0 ? [] : hits.hits.hits)
    );
  }

  /**
   * Icon
   * @param type - type of contribution
   * @return object
   */
  icon(type: string): { class: string, title: string } {
    switch (type) {
      case 'bf:Person':
        return { class: 'far fa-user', title: this._translateService.instant('Person') };
      case 'bf:Organisation':
        return { class: 'fa-building-o', title: this._translateService.instant('Organisation') };
      default:
        return { class: 'fa-question', title: this._translateService.instant('Missing type') };
    }
  }
}
