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

import { Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  // SERVICE ATTRIBUTES =======================================================

  /** Observable on Record Organisation */
  private _onOrganisationLoaded: Subject<any> = new Subject();
  /** Organisation record */
  private _record: any;

  // GETTER & SETTER ==========================================================
  /** Return observable of organisation */
  get onOrganisationLoaded$() {
    return this._onOrganisationLoaded.asObservable();
  }
  /** Get current organisation*/
  get organisation() {
    return this._record;
  }

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _recordService - RecordService
   */
  constructor(
    private _recordService: RecordService
  ) { }

  /**
   * Load organisation record
   * @param pid - string
   */
  loadOrganisationByPid(pid: string) {
    this._recordService
      .getRecord('organisations', pid)
      .subscribe((orgRecord: any) => {
        this._record  = orgRecord.metadata;
        this._onOrganisationLoaded.next(this._record);
      });
  }
}
