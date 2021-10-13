/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
 * Copyright (C) 2022 UCLouvain
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Record } from '@rero/ng-core/lib/record/record';
import { Observable, Subscription } from 'rxjs';
import { UserService } from '@rero/shared';
import { Library } from '../../../classes/library';

@Component({
  selector: 'admin-library-detail-view',
  templateUrl: './library-detail-view.component.html',
  styleUrls: ['./library-detail-view.component.scss']
})
export class LibraryDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  // COMPONENT ATTRIBUTES =====================================================
  /** Observable resolving record data */
  record$: Observable<any>;
  /** Resource type */
  type: string;
  /** the library record as `Library` */
  record: Library = null;
  /** linked locations */
  locations = [];
  /** Is the current logged user can add locations */
  isUserCanAddLocation = false;

  /** Record subscription */
  private _recordObs: Subscription;

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _userService - UserService
   */
  constructor(
    private _recordService: RecordService,
    private _userService: UserService
  ) { }

  /** OnInit hook */
  ngOnInit() {
   this._recordObs = this.record$.subscribe(
      (data) => {
        const libraryPid = data.metadata.pid;
        this.record = new Library(data.metadata);
        this.isUserCanAddLocation = this._userService.user.currentLibrary === libraryPid;
        // Load linked locations
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
          .subscribe((record: Record) => {
            this.locations = record.hits.hits || [];
          });
      }
    );
  }

  /** OnDestroy hook */
  ngOnDestroy(): void {
    this._recordObs.unsubscribe();
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Delete a location event listener
   * This function catch the event emitted when a location is deleted and removed the deleted location
   * from the known locations list
   * @param deletedLocationPid - The deleted location pid
   */
  deleteLocation(deletedLocationPid: Event): void {
    this.locations = this.locations.filter((location: any) => deletedLocationPid !== location.metadata.pid);
  }

}
