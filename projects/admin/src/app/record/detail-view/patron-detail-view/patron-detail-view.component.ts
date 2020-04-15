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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';
import { PatronService } from '../../../service/patron.service';

@Component({
  selector: 'admin-patron-detail-view',
  templateUrl: './patron-detail-view.component.html'
})
export class PatronDetailViewComponent implements OnInit, DetailRecord, OnDestroy {

  /** Observable resolving record data */
  record$: Observable<any>;

  /** Record subscription */
  private _recordObs: Subscription;

  /** Document record */
  record: any;

  /** record type */
  type: string;

  /** Constructor
   * @param _patronService : PatronService
   */
  constructor(private _patronService: PatronService) { }

  /**
   * Init
   */
  ngOnInit() {
    this._recordObs = this.record$.subscribe(record => {
      this.record = record;
      this._patronService.setRecord(record);
    });
  }

  /**
   * Destroy
   */
  ngOnDestroy(): void {
    this._recordObs.unsubscribe();
  }

  /** Check if the current logged user has a specific role
   * @return True | False depending if the current logged user has the desired role
   */
  hasRole(role: string): boolean {
    return this._patronService.hasRole(role);
  }
}
