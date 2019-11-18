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
import { RecordService, extractIdOnRef } from '@rero/ng-core';
import { LoanService } from '../../../service/loan.service';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'admin-item-detail-view',
  templateUrl: './item-detail-view.component.html',
  styles: []
})
export class ItemDetailViewComponent implements DetailRecord, OnInit {

  /** Observable resolving record data */
  record$: Observable<any>;

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
  ) { }

  ngOnInit() {
    this.record$.pipe(
      map(record => this.record = record),
      tap(record => this.loanService
        .numberOfRequests$(record.metadata.pid)
        .subscribe((count: number) => {
          this.numberOfRequests = count;
        })
      )
    ).pipe(
      switchMap(item => this.recordService.getRecord(
        'locations',
        item.metadata.location.pid
      ))
    ).pipe(
      switchMap(location => this.recordService.getRecord(
        'libraries',
        extractIdOnRef(location.metadata.library.$ref)
      )),
      map(location => this.location = location)
    ).pipe(
      map(library => this.library = library)
    ).subscribe();
  }
}
