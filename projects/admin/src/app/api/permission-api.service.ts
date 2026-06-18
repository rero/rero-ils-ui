// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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

export type IRolePermission = Record<string, IPermission>;

export type IPermission = {
  type: string,
  actions: Record<string, boolean | null>
}

export type IPatronPermission = {
  name: string,
  can: boolean,
  reasons: Record<string, boolean | null>
}
