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
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalFieldApiService } from '../api/local-field-api.service';

@Injectable({
  providedIn: 'root'
})
export class CanAddLocalFieldsGuard  {

  private userService: UserService = inject(UserService);
  private localFieldsApiService: LocalFieldApiService = inject(LocalFieldApiService);
  private router: Router = inject(Router);

  /**
   * This guards allows to control the existence of the resource
   * for the current organization. If a record exists, it blocks
   * the addition of a new resource.
   */

  /** Available type of document to add local fields */
  private _types = {
    documents: 'doc',
    holdings: 'hold',
    items: 'item'
  };

  /**
   * Can activate
   * @param next - ActivatedRouteSnapshot
   * @returns True if authorized access
   * @throws redirect to error 400
   */
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    const params = next.queryParams;
    if (params.type && params.ref) {
      const type = this._translateType(params.type);
      return this.localFieldsApiService.getByResourceTypeAndResourcePidAndOrganisationId(
        type,
        params.ref,
        this.userService.user.currentOrganisation
      ).pipe(map(record => {
        // False if the record metadata exists.
        return !!!(record.metadata);
      }));
    } else {
      this.router.navigate(['/errors/400'], { skipLocationChange: true });
      return of(false);
    }
  }

  /**
   * Translate type with a symbol
   * @param type - string, resource type
   * @return string - translated type
   * @throws redirect to error 400
   */
  private _translateType(type: string) {
    if (type in this._types) {
      return this._types[type];
    }
    this.router.navigate(['/errors/400'], { skipLocationChange: true });
  }
}
