/*
 * RERO ILS UI
 * Copyright (C) 2022-2024 RERO
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
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionApiService {

  private httpClient: HttpClient = inject(HttpClient);

  /**
   * Get All Permissions by role
   * @return Observable, array of IRolePermission
   */
   getAllPermissionsByRole(): Observable<IRolePermission> {
    return this.httpClient.get<IRolePermission>('/api/permissions/by_role');
  }

  /**
   *
   * @param pid - Patron pid
   * @returns Observable, array of permissions
   */
  getUserPermissions(pid: string): Observable<IPatronPermission[]> {
    return this.httpClient.get<any>(`/api/permissions/by_patron/${pid}`);
  }
}

export interface IRolePermission {
  [key: string]: IPermission
}

export interface IPermission {
  type: string,
  actions: {
    [key: string]: boolean | null
  }
}

export interface IPatronPermission {
  name: string,
  can: boolean,
  reasons: {
    [key: string]: boolean | null
  }
}
