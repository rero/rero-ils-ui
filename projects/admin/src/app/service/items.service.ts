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

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, RecordService, RecordUiService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Item, ItemAction, ItemNoteType, ItemStatus } from '../class/items';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ItemsService {

  /**
   * constructor
   * @param _http - HttpClient
   * @param _recordService - RecordService
   * @param _recordUiService - RecordUiService
   * @param _apiService - ApiService
   * @param _translateService - TranslateService
   */
  constructor(
    private _http: HttpClient,
    private _recordService: RecordService,
    private _recordUiService: RecordUiService,
    private _apiService: ApiService,
    private _translateService: TranslateService
  ) { }

  getRequestedLoans(libraryPid) {
    const url = `/api/item/requested_loans/${libraryPid}`;
    return this._http.get<any>(url).pipe(
      map(data => data.hits),
      map(hits => hits.total === 0 ? [] : hits.hits),
      map(hits => hits.map(
        data => {
          const item = data.item;
          if (data.loan) {
            item.loan = data.loan;
          }
          return item;
        }
        ))
      );
  }

  doValidateRequest(item, transactionLibraryPid) {
    const url = '/api/item/validate';
    return this._http.post<any>(url, {
      item_pid: item.pid,
      pid: item.loan.pid,
      transaction_library_pid: transactionLibraryPid
    }).pipe(
    map(data => {
      const itemData = data.metadata;
      itemData.loan = data.action_applied.validate;
      return itemData;
    })
    );
  }

  getItem(barcode: string, patronPid?: string) {
    let url = `/api/item/barcode/${barcode}`;
    if (patronPid) {
      url = url + `?patron_pid=${patronPid}`;
    }
    return this._http.get<any>(url).pipe(
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
            throw new Error('item not found');
          default:
            throw e;
        }
      })
    );
  }

  /** Do automatic checkin and get applied actions
   * @param itemBarcode: item barcode
   * @param transactionLibraryPid: transaction library
   */
  automaticCheckin(itemBarcode, transactionLibraryPid) {
    const url = '/api/item/automatic_checkin';
    return this._http.post<any>(url, {item_barcode: itemBarcode, transaction_library_pid: transactionLibraryPid}).pipe(
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
        }
      })
    );
  }

  doAction(item, transactionLibraryPid, userPid, patronPid?: string) {
    const action = item.currentAction;
    const url = `/api/item/${action}`;
    const data: any = {
      item_pid: item.pid,
      transaction_library_pid: transactionLibraryPid,
      transaction_user_pid: userPid
    };
    if (patronPid && action === ItemAction.checkout) {
      data.patron_pid = patronPid;
    }
    if (item.loan) {
      data.pid = item.loan.pid;
    }
    return this._http.post<any>(url, data).pipe(
      map(itemData => {
        const newItem = new Item(itemData.metadata);
        newItem.actionDone = action;
        newItem.setLoan(Object.values(itemData.action_applied).pop());
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
    const url = `/api/item/${itemPid}/pickup_locations`;
    return this._http.get<any>(url).pipe(
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
    return this._http.get(`/api/item/${itemPid}/can_request`, { params });
  }

  /** Is a callout wrapper is required for this item.
   *
   * A callout wrapper is a visual css information to indicate to user than something happens
   * on an element
   *
   * @param item: the item to analyse
   * @param type: the callout type (error, warning, info, ...)
   * @return true if the callout is required, false otherwise
   */
  needCallout(item: Item, type?: string): boolean {
    if (type == null) {
      type = 'warning';
    }
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
