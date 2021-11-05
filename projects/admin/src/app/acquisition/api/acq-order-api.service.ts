/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
 * Copyright (C) 2021 UCLouvain
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
import { Observable } from 'rxjs';
import { AcqAddressRecipient } from '../classes/order';

@Injectable({
  providedIn: 'root'
})
export class AcqOrderApiService {

  // SERVICES ATTRIBUTES ======================================================
  /** The resource name of acquisition account */
  resourceName = 'acq_orders';

  // CONSTRUCTOR ==============================================================
  /**
   * Constructor
   * @param _http - HttpClient
   */
  constructor(
    private _http: HttpClient
  ) { }

  // SERVICE PUBLIC FUNCTIONS =================================================
  /**
   * Load an order from this pid
   * @param orderPid: the order pid
   * @return: the corresponding AcqOrder
   */
  getOrder(orderPid: string): Observable<any> {
    const apiUrl = `/api/${this.resourceName}/${orderPid}`;
    return this._http.get<any>(apiUrl);
  }

  /**
   * Get an order preview.
   * @param orderPid: the order pid
   */
  getOrderPreview(orderPid: string): Observable<any> {
    const apiUrl = `/api/acq_order/${orderPid}/acquisition_order/preview`;
    return this._http.get<any>(apiUrl);
  }

  /**
   * Validate and send an order.
   * @param orderPid: the order pid
   * @param emails: the recipients emails address
   */
  createOrder(orderPid: string, emails: AcqAddressRecipient[]): Observable<any> {
    const apiUrl = `/api/acq_order/${orderPid}/send_order`;
    return this._http.post<any>(apiUrl, {emails});
  }
}
