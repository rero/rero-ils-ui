/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { RecordService } from '@rero/ng-core';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryApiService {

  private http: HttpClient = inject(HttpClient);
  private recordService: RecordService = inject(RecordService);

  /**
   * Get library by pid
   * @param pid - the library pid
   * @returns the library metadata
   */
  getByPid(pid: string): Observable<any> {
    return this.recordService.getRecord('libraries', pid)
      .pipe(map(record => record.metadata));
  }

  /**
   * Allow to get the closed date between two dates for a specific library
   * @param libraryPid: the library pid
   * @param from: the lower interval (optional)
   * @param until: the upper interval (optional)
   */
  getClosedDates(libraryPid: string, from?: string, until?: string): Observable<Array<moment>> {
    from = from || moment().subtract(1, 'month');
    until =  until || moment().add(1, 'year');
    return this.http.get(`/api/library/${libraryPid}/closed_dates`, {params: {from, until}}).pipe(
      map((data: any) => data.closed_dates),
      map((dates: [string]) => dates.map(dateStr => moment(dateStr)))
    );
  }
}
