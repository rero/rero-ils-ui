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

import { Component, Input, OnInit } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { OrganisationService } from '../../service/organisation.service';
import { Item, LoanState } from '../items';

@Component({
  selector: 'admin-item',
  templateUrl: './item.component.html'
})
export class ItemComponent implements OnInit {

  /** Current item */
  @Input() item: any;

  /** Current patron */
  @Input() patron: any;

  /** Is collapsed */
  isCollapsed = true;

  /** Total amount of fee */
  totalAmountOfFee = 0;

  /** Notifications related to the current loan */
  notifications$: Observable<any>;

  /**
   * Constructor
   * @param recordService: Record Service
   * @param organisationService: Organisation Service
   */
  constructor(
    private recordService: RecordService,
    private organisationService: OrganisationService
    ) {  }

  /**
   * On init hook
   */
  ngOnInit() {
    if (this.item && this.item.loan && this.item.loan.pid) {
      const loanPid = this.item.loan.pid;

      this.recordService.getRecords(
        'fees', `loan.pid:${loanPid} AND fee_type:overdue`, 1, RecordService.MAX_REST_RESULTS_SIZE).pipe(
        map((results: any) => results.hits.hits),
        map((fees: any) => this._getTotalAmountOfFees(fees))
      ).subscribe(total => this.totalAmountOfFee = total);

      this.notifications$ = this.recordService.getRecords(
        'notifications', `loan.pid:${loanPid}`, 1, RecordService.MAX_REST_RESULTS_SIZE).pipe(
        map((results: any) => results.hits.hits)
      );
    }
  }

  /** Get total amount of fees
   * @param fees: fees of the current item
   */
  private _getTotalAmountOfFees(fees: any): number {
    let total = 0;
    for (const fee of fees) {
      total += fee.metadata.amount;
    }
    return total;
  }

  /** Check if current item is a patron loan */
  get patronLoan(): boolean {
    return this.item.status !== 'on_loan' && this.patron;
  }

  /** Get transit location pid
   * @param item: current item
   * @return: transit location pid
   */
  getTransitLocationPid(item: Item) {
    if (item.loan && item.loan.state === LoanState.ITEM_IN_TRANSIT_FOR_PICKUP) {
      return item.loan.pickup_location_pid;
    }
    if (item.loan && item.loan.state === LoanState.ITEM_IN_TRANSIT_TO_HOUSE) {
      return item.location.pid;
    }
    return null;
  }

  /** Get current organisation
   * @return: current organisation
   */
  get organisation() {
    return this.organisationService.organisation;
  }
}
