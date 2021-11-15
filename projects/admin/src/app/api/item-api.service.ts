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
   */
  constructor(private _recordService: RecordService) {}

  getItem(pid: string): Observable<any> {
    return this._recordService.getRecord(this.RESOURCE_NAME, pid).pipe(
      map((result: any) => result.metadata)
    );
  }
}
