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
import { Item } from '../circulation/items';
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

  get currentPatron$(): Observable<User> {
    return this._currentPatron.asObservable();
  }

  clearPatron() {
    this._currentPatron.next(undefined);
  }

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

  getItems(patronPid: string) {
    const itemApiUrl = this.apiService.getEndpointByType('item');
    const url = `${itemApiUrl}/loans/${patronPid}`;
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
}
