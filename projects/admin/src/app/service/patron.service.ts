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
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService, RecordService } from '@rero/ng-core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Item, LoanState } from '../circulation/items';
import { User } from '../class/user';

@Injectable({
  providedIn: 'root'
})
export class PatronService {
  private _patron: any;
  private _currentPatron: BehaviorSubject<User> = new BehaviorSubject(
    undefined
  );

  constructor(
    private http: HttpClient,
    private apiService: ApiService,
    private recordService: RecordService
  ) {}

  /**
   * Set Patron record
   * @param patron - patron record
   */
  setRecord(patron: any) {
    this._patron = patron.metadata;
  }

  /**
   * has role
   * @param role - name of role
   */
  hasRole(role: string) {
    if (this._patron && this._patron.roles) {
      return this._patron.roles.some((r: string) => r === role);
    }
    return false;
  }

  /**
   * Get Current Patron
   * @return Observable
   */
  get currentPatron$(): Observable<User> {
    return this._currentPatron.asObservable();
  }

  /**
   * Clear patron
   */
  clearPatron() {
    this._currentPatron.next(undefined);
  }

  /**
   * Get patron by barcode
   * @param barcode - string
   * @return Observable
   */
  getPatron(barcode: string): Observable<any> {
    return this.recordService
      .getRecords('patrons', `barcode:${barcode}`, 1, 1)
      .pipe(
        switchMap(response => {
          switch (response.hits.total) {
            case 0: {
              this._currentPatron.next(null);
              break;
            }
            case 1: {
              const patron = new User(response.hits.hits[0].metadata);
              this._currentPatron.next(patron);
              break;
            }
            default: {
              throw new Error('too much results');
            }
          }
          return this._currentPatron.asObservable();
        })
      );
  }

  /**
   * Get Item by Patron Pid
   * @param patronPid - string
   * @return observable
   */
  getItems(patronPid: string) {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    const url = `${itemApiUrl}/loans/${patronPid}?sort=-transaction_date`;
    return this.http.get<any>(url).pipe(
      map(data => data.hits),
      map(hits => (hits.total === 0 ? [] : hits.hits)),
      map(hits =>
        hits.map(data => {
          const item = new Item(data.item);
          if (data.loan) {
            item.setLoan(data.loan);
          }
          return item;
        })
      )
    );
  }

  /**
   * Get Item by barcode
   * @param barcode - string
   * @return Observable
   */
  getItem(barcode: string) {
    return this.http
      .get<any>(`/api/item/barcode/${barcode}`)
      .pipe(map(response => {
        const data = response.metadata.item;
        const item = new Item(data);
        item.setLoan(response.metadata.loan);
        return item;
      }));
  }

  /**
   * Get items requested
   * @param patronPid - string
   * @return Observable
   */
  getItemsRequested(patronPid: string) {
    return this.getLoans(
      `patron_pid:${patronPid} AND (state:PENDING OR state:ITEM_IN_TRANSIT_FOR_PICKUP)`
    );
  }

  /**
   * Get items pickup
   * @param patronPid - string
   * @return Observable
   */
  getItemsPickup(patronPid: string) {
    return this.getLoans(
      `patron_pid:${patronPid} AND state:ITEM_AT_DESK`
    );
  }

  /**
   * Get items history
   * @param patronPid - string : the patron pid to search
   * @param fromLimit - int: low interval boundary (in days from now). Default is 183 (6 months)
   * @param toLimit - int: high interval boundary (in days from now). Default is 0 (today)
   * @return Observable
   */
  getHistory(patronPid: string, fromLimit?: number, toLimit?: number) {
    fromLimit = fromLimit || Math.round(6 * 365 / 12);  // 6 months
    toLimit = toLimit || 0;
    const states = [LoanState.CANCELLED, LoanState.ITEM_RETURNED];
    const statesQuery = states.map(state => `state:${state}`).join(' OR ');
    const query = `patron_pid:${patronPid} AND (${statesQuery}) end_date:[now-${fromLimit}d/d TO now-${toLimit}d/d]`;
    return this.getLoans(query, '-end_date');
  }

  /**
   * Get Loans by query
   * @param query - string : Query to execute to find loans
   * @param sort - string : Sorting criteria
   * @return Observable
   */
  private getLoans(query: string, sort?: string) {
    return this.recordService.getRecords(
      'loans', query, 1, RecordService.MAX_REST_RESULTS_SIZE, [], {}, null, sort
    ).pipe(
      map(data => data.hits),
      map(hits => (hits.total === 0 ? [] : hits.hits))
    );
  }
}
