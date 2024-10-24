/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryGuard } from './library.guard';

@Injectable({
  providedIn: 'root'
})
export class AcqOrderLineGuard extends LibraryGuard {

  private recordService: RecordService = inject(RecordService);

  /**
   * Return the library linked to an acquisition order number.
   * @param route: the current URL route
   * @return: the library pid linked to the resource from the 'order' query parameters
   */
  getOwningLibrary$(route: ActivatedRouteSnapshot): Observable<string> {
    let orderPid = route.queryParams.order;
    if (orderPid === undefined) {
       orderPid = route.params.pid;
    }
    return this.recordService.getRecord('acq_orders', orderPid).pipe(
      map(data => data.metadata || {}),
      map(metadata => metadata.library || {}),
      map(library => extractIdOnRef(library.$ref))
    );
  }
}
