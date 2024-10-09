/*
 * RERO ILS UI
 * Copyright (C) 2019-204 RERO
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
import { inject, Injectable } from '@angular/core';
import { ApiService, RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { User } from '@rero/shared';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Item } from '../classes/items';
import { Loan, LoanOverduePreview, LoanState } from '../classes/loans';

@Injectable({
  providedIn: 'root'
})
export class PatronService {

  private httpClient: HttpClient = inject(HttpClient);
  private apiService: ApiService = inject(ApiService);
  private recordService: RecordService = inject(RecordService);

  /** Current patron */
  private currentPatron: BehaviorSubject<User> = new BehaviorSubject(undefined);

  /**
   * Get Current Patron
   * @return Observable
   */
  get currentPatron$(): Observable<User> {
    return this.currentPatron.asObservable();
  }

  /**
   * Clear patron
   */
  clearPatron() {
    this.currentPatron.next(undefined);
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
        switchMap((response: Record) => {
          switch (this.recordService.totalHits(response.hits.total)) {
            case 0: {
              this.clearPatron();
              break;
            }
            case 1: {
              const patron = response.hits.hits[0].metadata;
              this.currentPatron.next(patron);
              break;
            }
            default: {
              throw new Error('too much results');
            }
          }
          return this.currentPatron.asObservable();
        })
      );
  }

  /**
   * Get patron by pid
   * @param pid - string : the patron pid
   * @return Observable on patron metadata.
   */
  getPatronByPid(pid: string): Observable<any> {
    return this.recordService
      .getRecord('patrons', pid)
      .pipe(map((data: any) => data.metadata))
  }

  /**
   * Get Items on loan for a patron
   * @param patronPid - string: the patron pid
   * @param sort - string: the sort criteria to use (-transaction_date by default)
   * @return observable
   */
  getItems(patronPid: string, sort?: string) {
    if (sort === undefined) {
      sort = '-transaction_date';
    }
    const itemApiUrl = this.apiService.getEndpointByType('item');
    const url = `${itemApiUrl}/loans/${patronPid}?sort=${sort}`;
    return this.httpClient.get<any>(url).pipe(
      map(data => data.hits),
      map(hits => this.recordService.totalHits(hits.total === 0) ? [] : hits.hits),
      map(hits => hits.map((data: any) => this._buildItem(data)))
    );
  }

  /**
   * Get Item by barcode
   * @param barcode - string
   * @return Observable
   */
  getItem(barcode: string) {
    return this.httpClient
      .get<any>(`/api/item/barcode/${barcode}`)
      .pipe(
        map(response => this._buildItem(response.metadata))
      );
  }

  /**
   * Build an Item object instance based on metadata from backend
   * @param data - any: the item metadata
   * @return Item
   */
  private _buildItem(data: any): Item {
    const item = new Item(data.item);
    if (data.loan) {
      item.setLoan(data.loan);
    }
    return item;
  }

  /**
   * Get pending items for a patron
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
    const states = [
      LoanState.CANCELLED,
      LoanState.ITEM_IN_TRANSIT_TO_HOUSE,
      LoanState.ITEM_RETURNED
    ];
    const statesQuery = states.map(state => `state:${state}`).join(' OR ');
    const query = `patron_pid:${patronPid} AND (${statesQuery}) end_date:[now-${fromLimit}d/d TO now-${toLimit}d/d]`;
    return this.getLoans(query, 'duedate');
  }

  /**
   * Get circulation statistics about a patron
   * @param patronPid - string : the patron pid to search
   * @return Observable
   */
  getCirculationInformations(patronPid: string): Observable<any> {
    const url = [this.apiService.getEndpointByType('patrons'), patronPid, 'circulation_informations'].join('/');
    return this.httpClient.get(url);
  }

  /**
   * Get overdue preview about overdue loans related to a patron.
   * @param patronPid - string : the patron pid to search
   * @return Observable
   */
  getOverduesPreview(patronPid: string): Observable<Array<{fees: LoanOverduePreview, loan: Loan}>> {
    const url = [this.apiService.getEndpointByType('patrons'), patronPid, 'overdues', 'preview'].join('/');
    return this.httpClient.get(url).pipe(
      map((data: Array<any>) => data.map(record => {
        return {
          fees: record.fees as LoanOverduePreview,
          loan: new Loan(record.loan)
        };
      }))
    );
  }

  /**
   * Get Loans by query
   * @param query - string : Query to execute to find loans
   * @param sort - string : Sorting criteria
   * @return Observable
   */
  private getLoans(query: string, sort?: string) {
    return this.recordService.getRecords(
      'loans', query, 1, RecordService.MAX_REST_RESULTS_SIZE, [], {}, {Accept: 'application/rero+json'}, sort
    ).pipe(
      map((data: Record) => data.hits),
      map(hits => this.recordService.totalHits(hits.total) === 0 ? [] : hits.hits)
    );
  }

  /**
   * Get formatted name of a patron
   * @param patron: the patron to format
   * @return the formatted name (name[, firstname])
   */
  getFormattedName(patron: any): string {
    return [
      patron.last_name || null,
      patron.first_name || null
    ].filter(el => el !== null) // remove potential empty values
     .map(el => el.trim())      // trim all values
     .join(', ');               // join values
  }
}
