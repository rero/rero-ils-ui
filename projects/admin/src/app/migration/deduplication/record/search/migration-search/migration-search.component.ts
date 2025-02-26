/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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

import { Component } from '@angular/core';
import { Record, RecordSearchComponent } from '@rero/ng-core';
import { map, tap } from 'rxjs';

@Component({
    selector: 'admin-migration-search',
    templateUrl: './migration-search.component.html',
    styles: [
        `
    li.list-group-item {
      border-bottom-style: double;
      border-bottom-width: 4px;
    }
  `
    ],
    standalone: false
})
export class MigrationSearchComponent extends RecordSearchComponent {

  /**
   * Refresh the results page.
   *
   * @param refresh - boolean
   *  */
  refresh(refresh: boolean): void {
    if (refresh) {
      this._getRecords()
        .pipe(
          map((records: Record) => {
            // reload hits
            if (records?.hits != null) {
              this.hits = records.hits;
            }
            return records;
          }),
          map((records: Record) => {
            // reload aggregations
            if (records?.hits != null) {
              for (const agg of this.aggregations) {
                agg.loaded = false;
                agg.value.buckets = [];
                if (agg.key in records.aggregations) {
                  this._mapAggregation(agg, records.aggregations[agg.key]);
                }
              }
            }
            return records;
          }),
          // hide spinner in any cases
          tap(() => this.spinner.hide())
        )
        .subscribe();
    }
  }
}
