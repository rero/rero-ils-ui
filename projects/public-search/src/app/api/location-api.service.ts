/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationApiService {

  /**
   * Constructor
   * @param _httpClient - HttpClient
   */
  constructor(
    private _httpClient: HttpClient
  ) { }

  /**
   * Get pickup locations by viewcode
   * @param itemPid - string
   * @return Observable
   */
  getPickupLocationsByItemId(itemPid: string) {
    return this._httpClient
      .get<any>(`/api/item/${itemPid}/pickup_locations`)
      .pipe(map(result => {
        const locations = [];
        if (result) {
          result.locations.forEach((location: any) => {
            locations.push({
              pid: location.pid,
              name: location.pickup_name ? location.pickup_name : location.name
            });
          });
        }
        return locations;
      }));
  }
}
