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

import { Component, Input } from '@angular/core';
import { ResultItem, RecordService } from '@rero/ng-core';

@Component({
  selector: 'admin-libraries-brief-view',
  templateUrl: './libraries-brief-view.component.html',
  styles: []
})
export class LibrariesBriefViewComponent implements ResultItem {

  /** Record data */
  @Input()
  record: any;

  /** Resource type */
  @Input()
  type: string;

  /** Detail URL to navigate to detail view */
  @Input()
  detailUrl: { link: string, external: boolean };

  /** Is collapsed variable */
  isCollapsed = true;

  /** Locations array */
  locations = [];

  /** Constructor */
  constructor(
    private recordService: RecordService
  ) { }

  /** Toggle collapse to display related locations */
  toggleCollapse() {
    if (this.isCollapsed) {
      const libraryPid = this.record.metadata.pid;
      this.recordService
        .getRecords('locations', `library.pid:${libraryPid}`, 1, RecordService.MAX_REST_RESULTS_SIZE)
        .subscribe(data => {
          this.locations = data.hits.hits || [];
          this.isCollapsed = !this.isCollapsed;
        });
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  /**
   * Delete the location
   * @param locationPid - location PID
   */
  deleteLocation(locationPid: Event) {
    this.locations = this.locations.filter((location: any) => locationPid !== location.metadata.pid);
  }

}
