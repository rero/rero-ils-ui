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
import { Injectable } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanService {

  statusBorrow = {
    ON_LOAN: 'ITEM_ON_LOAN'
  };

  statusRequest = {
    ON_DESK: 'ITEM_ON_DESK',
    PENDING: 'PENDING',
    IN_TRANSIT_FOR_PICKUP: 'ITEM_IN_TRANSIT_FOR_PICKUP'
  };

  /**
   * Constructor
   * @param recordService RecordService
   */
  constructor(private recordService: RecordService) { }

  /**
   * Return the number of request(s) on item
   * @param itemPid Item Pid
   * @return Observable
   */
  numberOfRequests$(itemPid: string) {
    const states = Object.values(this.statusRequest).join(' OR state:');
    const query = `item_pid:${itemPid} AND (state:${states})`;
    return this.recordService.getRecords('loans', query, 1, 0).pipe(
      map(result => result.hits.total)
    );
  }

  /**
   * Return a borrowed loan record
   * @param itemPid Item Pid
   * @return Observable
   */
  borrowedBy$(itemPid: string) {
    return this.loans$(itemPid).pipe(
      map(results => results.hits.hits.filter((data: any) =>
        data.metadata.state === this.statusBorrow.ON_LOAN
      ))
    );
  }

  /**
   * Return a list of requested loan(s)
   * @param itemPid Item Pid
   * @return Observable
   */
  requestedBy$(itemPid: string) {
    return this.loans$(itemPid).pipe(
      map(results => results.hits.hits.filter((data: any) =>
          data.metadata.state === this.statusRequest.ON_DESK
          || data.metadata.state === this.statusRequest.PENDING
          || data.metadata.state === this.statusRequest.IN_TRANSIT_FOR_PICKUP
      ))
    );
  }

  /**
   * @param itemPid Item Pid
   * @return Observable
   */
  private loans$(itemPid: string) {
    // TODO: Add sort parameter on transaction_date (after update ng-core)
    const statuses = [
      ...Object.values(this.statusBorrow),
      ...Object.values(this.statusRequest)
    ];
    const states = statuses.join(' OR state:');
    const query = `item_pid:${itemPid} AND (state:${states})`;
    return this.recordService.getRecords('loans', query, 1, 100);
  }
}
