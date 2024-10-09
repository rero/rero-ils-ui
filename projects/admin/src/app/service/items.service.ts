/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiService, RecordService } from '@rero/ng-core';
import { BaseApi, ItemStatus, UserService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Item, ItemAction, ItemNoteType } from '../classes/items';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  private httpClient: HttpClient = inject(HttpClient);
  private userService: UserService = inject(UserService);
  private recordService: RecordService = inject(RecordService);
  private apiService: ApiService = inject(ApiService);

  /**
   * Get item by pid from elasticsearch
   * @param pid - String
   * @returns Observable<any>
   */
  getByPidFromEs(pid: string): Observable<any> {
    return this.recordService.getRecords(
      'items', `pid:${pid}`, 1, 1, undefined, undefined, BaseApi.reroJsonheaders
    ).pipe(map((result: any) => result.hits.hits[0]));
  }

  /**
   * Get Requested loans
   * @param libraryPid - string
   * @return Observable<any>
   */
  getRequestedLoans(libraryPid): Observable<any> {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    const url = `${itemApiUrl}/requested_loans/${libraryPid}`;
    return this.httpClient.get<any>(url).pipe(
      map(data => data.hits),
      map(hits => this.recordService.totalHits(hits.total) === 0 ? [] : hits.hits),
      map(hits => hits.map(
        data => {
          const { item } = data;
          if (data.loan) {
            item.loan = data.loan;
          }
          return item;
        }
        ))
      );
  }

  /**
   * Do validate quest
   * @param item - object
   * @param transactionLibraryPid - string
   * @return Observable<any>
   */
  doValidateRequest(item, transactionLibraryPid): Observable<any> {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    const url = `${itemApiUrl}/validate_request`;
    return this.httpClient.post<any>(url, {
      item_pid: item.pid,
      pid: item.loan.pid,
      transaction_library_pid: transactionLibraryPid,
      transaction_user_pid: this.userService.user.patronLibrarian.pid
    }).pipe(
      map(data => {
        const itemData = data.metadata;
        itemData.loan = data.action_applied.validate;
        return itemData;
      })
    );
  }

  /**
   * Get item
   * @param barcode - string
   * @param patronPid - string
   * @return Observable<any>
   */
  getItem(barcode: string, patronPid?: string): Observable<any> {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    let url = `${itemApiUrl}/barcode/${barcode}`;
    if (patronPid) {
      url += `?patron.patron_pid=${patronPid}`;
    }
    return this.httpClient.get<any>(url).pipe(
      map(data => {
        const item = new Item(data.metadata.item);
        if (data.metadata.loan) {
          item.setLoan(data.metadata.loan);
        }
        return item;
      }),
      catchError(e => {
        switch (e.status) {
          case 404:
            throw new Error('Item not found');
          default:
            throw e;
        }
      })
    );
  }

  /**
   * Do checkin and get applied actions
   * @param barcode: item barcode
   * @param transactionLibraryPid: transaction library
   */
  checkin(barcode: string, transactionLibraryPid: string) {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    return this.httpClient.post<any>(`${itemApiUrl}/checkin`, {
      item_barcode: barcode,
      transaction_library_pid: transactionLibraryPid,
      transaction_user_pid: this.userService.user.patronLibrarian.pid
    }).pipe(
      map(data => {
        const item = new Item(data.metadata);
        const actions = Object.keys(data.action_applied);
        let loan: any;

        item.action_applied = data.action_applied;
        actions.forEach(action => {
          if (action === 'checkin' || action === 'receive') {
            item.actionDone =  ItemAction[action];
          }
        });
        if (data.action_applied[ItemAction.checkin]) {
          loan = data.action_applied[ItemAction.checkin];
        }
        if (data.action_applied[ItemAction.receive]) {
          loan = data.action_applied[ItemAction.receive];
        }
        if (data.action_applied[ItemAction.validate]) {
          loan = data.action_applied[ItemAction.validate];
        }
        if (loan != null) {
          item.setLoan(loan);
        }
        return item;
      }),
      catchError(e => {
        if (e.status === 404) {
          return of(null);
        } else {
          throw e;
        }
      })
    );
  }

  /**
   * Call the circulation API corresponding to the item current action
   * @param item: the item to be proceed
   * @param transactionLibraryPid: the transaction library pid
   * @param userPid: the user pid operate the circulation operation
   * @param patronPid: the patron related to the circulation operation
   * @param additionalParams: additional parameters to send as query string arguments
   */
  doAction(item, transactionLibraryPid: string, userPid: string, patronPid?: string, additionalParams?: any) {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    const action = item.currentAction;
    const url = `${itemApiUrl}/${action}`;

    // Build the body data to send to the API
    const data: any = {
      item_pid: item.pid,
      transaction_library_pid: transactionLibraryPid,
      transaction_user_pid: userPid
    };
    if (patronPid && action === ItemAction.checkout) {
      data.patron_pid = patronPid;
      // for a checkout operation, check the additionalParams to find a fixed endDate.
      // If found, use this endDate as the transaction end date
      if (additionalParams && 'endDate' in additionalParams) {
        data.end_date = additionalParams.endDate;
      }
    }
    if (item.loan) {
      data.pid = item.loan.pid;
    }

    // Build the query param to add to the API query string
    const queryParams = {};
    if (additionalParams && 'overrideBlocking' in additionalParams) {
      const key = 'override_blocking';
      queryParams[key] = true;
    }

    return this.httpClient.post<any>(url, data, {params: queryParams}).pipe(
      map(itemData => {
        const newItem = new Item(itemData.metadata);
        newItem.actionDone = action;
        // Set the action applied corresponding to current action as the loan of the item
        newItem.setLoan(itemData.action_applied[action]);
        return newItem;
      })
    );
  }

  /**
   * Get the available pickup locations for an item.
   * @param itemPid: the item pid to be requested
   * @return an observable on the API call response
   */
  getPickupLocations(itemPid): Observable<any> {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    const url = `${itemApiUrl}/${itemPid}/pickup_locations`;
    return this.httpClient.get<any>(url).pipe(
      map(data => data.locations),
      catchError(e => {
        if (e.status === 404) {
          return of(null);
        }
      })
    );
  }

  /**
   * Check if an item can be requested.
   * @param itemPid: the item pid to check
   * @param libraryPid: the library_pid to check
   * @param patronBarcode: the patron barcode to check
   * @return an observable on the API call response
   */
  canRequest(itemPid: string, libraryPid?: string, patronBarcode?: string): Observable<any> {
    let params = new HttpParams();
    if (libraryPid != null) {
      params = params.set('library_pid', libraryPid);
    }
    if (patronBarcode != null) {
      params = params.set('patron_barcode', patronBarcode);
    }
    const itemApiUrl = this.apiService.getEndpointByType('item');
    return this.httpClient.get(`${itemApiUrl}/${itemPid}/can_request`, { params });
  }

  /** Is a callout wrapper is required for this item.
   *
   * A callout wrapper is a visual css information to indicate to user than something happens
   * on an element
   *
   * @param item: the item to analyze
   * @param type: the callout type (error, warning, info, ...)
   * @return true if the callout is required, false otherwise
   */
  needCallout(item: Item, type?: string): boolean {
    type = type || 'warning';
    // WARNING ~~~~~~~~~~~~~~~~~~~~~~~
    if (type === 'warning') {
      if (item.actionDone && item.actionDone === ItemAction.checkin) {
        return item.status === ItemStatus.IN_TRANSIT
            || (item.pending_loans && item.pending_loans.length > 0)
            || item.getNote(ItemNoteType.CHECKIN) != null;
      }
      if (item.actionDone && item.actionDone === ItemAction.checkout) {
        return item.getNote(ItemNoteType.CHECKOUT) != null;
      }
    }
    // DEFAULT ~~~~~~~~~~~~~~~~~~~~~~~
    return false;
  }
}
