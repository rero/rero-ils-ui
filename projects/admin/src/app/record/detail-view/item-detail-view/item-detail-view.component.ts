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
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { LoanService } from '../../../service/loan.service';

@Component({
  selector: 'admin-item-detail-view',
  templateUrl: './item-detail-view.component.html',
  styles: []
})
export class ItemDetailViewComponent implements DetailRecord, OnInit, OnDestroy {
  /** Observable resolving record data */
  record$: Observable<any>;

  /** Record subscription */
  private _recordObs: Subscription;

  /** Resource type */
  type: string;

  /** Document record */
  record: any;

  /** Location record */
  location: any;

  /** Library record */
  library: any;

  /** Number of requested items */
  numberOfRequests: number;

  /**
   * Constructor
   * @param recordService - RecordService
   * @param loanService - LoanService
   */
  constructor(
    private recordService: RecordService,
    private loanService: LoanService
  ) {}

  ngOnInit() {
    this._recordObs = this.record$.subscribe( record => {
      this.record = record;
      const numberOfRequest$ = this.loanService.numberOfRequests$(record.metadata.pid);
      const locationRecord$ = this.recordService.getRecord('locations', record.metadata.location.pid);
      forkJoin([numberOfRequest$, locationRecord$]).subscribe(
        ([numberOfRequest, location]) => {
          this.numberOfRequests = numberOfRequest;
          this.location = location;
          this.recordService.getRecord('libraries', extractIdOnRef(location.metadata.library.$ref)).subscribe(
            library => this.library = library
          );
        }
      );
    });
  }

  ngOnDestroy() {
    this._recordObs.unsubscribe();
  }
}
