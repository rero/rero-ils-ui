/*
 * RERO ILS UI
 * Copyright (C) 2021-2023 RERO
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
import { RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ItemApiService {

  /** Ressource name */
  readonly RESOURCE_NAME = 'items';

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _http - HttpClient
   */
  constructor(
    private _recordService: RecordService,
    private _http: HttpClient
  ) {}

  /**
   * Get item
   * @param pid - the item pid
   * @returns Observable of the item data
   */
  getItem(pid: string): Observable<any> {
    return this._recordService.getRecord(this.RESOURCE_NAME, pid).pipe(
      map((result: any) => result.metadata)
    );
  }

  /**
   * Get stats of the item
   * @param itemPid - The item pid
   * @returns Observable of the stats of item
   */
  getStatsByItemPid(itemPid: string) {
    return this._http.get<any>(`/api/item/${itemPid}/stats`);
  }
}
