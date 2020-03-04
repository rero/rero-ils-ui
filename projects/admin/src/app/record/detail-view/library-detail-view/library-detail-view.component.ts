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
import { UserService } from '../../../service/user.service';

@Component({
  selector: 'admin-library-detail-view',
  templateUrl: './library-detail-view.component.html',
  styles: []
})
export class LibraryDetailViewComponent implements DetailRecord, OnInit {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Resource type */
  type: string;

  /** linked locations */
  locations = [];

  constructor(
    private _recordService: RecordService,
    private _userService: UserService
  ) { }

  ngOnInit() {
    // Load linked locations
    this.record$.subscribe(
      (data) => {
        const libraryPid = data.metadata.pid;
        this._recordService
          .getRecords(
            'locations',
            `library.pid:${libraryPid}`,
            1,
            RecordService.MAX_REST_RESULTS_SIZE,
            [],  // aggFilters
            {},  // preFilters
            null,  // headers
            'name'
          )
          .subscribe((record) => {
            this.locations = record.hits.hits || [];
          });
      }
    );
  }

  /** Delete a location event listener
   *  This function catch the event emitted when a location is deleted and removed the deleted location
   *  from the known locations list
   *  @param deletedLocationPid - The deleted location pid
   */
  deleteLocation(deletedLocationPid: Event) {
    this.locations = this.locations.filter((location: any) => deletedLocationPid !== location.metadata.pid);
  }

}
