/*
 * RERO ILS UI
 * Copyright (C) 2022 RERO
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

@Injectable({
  providedIn: 'root'
})
export class PermissionApiService {
  /**
   * Constructor
   * @param _http - HttpClient
   */
  constructor(private _http: HttpClient) {}

  /**
   * Get All Permissions by role
   * @return Observable, array of IRolePermission
   */
   getAllPermissionsByRole(): Observable<IRolePermission> {
    return this._http.get<IRolePermission>('/api/permissions/by_role');
  }
}

export interface IRolePermission {
  [key: string]: IPermission
}

export interface IPermission {
  [key: string]: boolean | null
}
