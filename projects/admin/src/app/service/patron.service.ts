/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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

@Injectable({
  providedIn: 'root'
})
export class PatronService {

  private _patron: any;

  /**
   * Set Patron record
   * @param patron - patron record
   */
  setRecord(patron: any) {
    this._patron = patron.metadata;
  }

  /**
   * has role
   * @param role - name of role
   */
  hasRole(role: string) {
    if (this._patron && this._patron.roles) {
      return this._patron.roles.some((r: string) => r === role);
    }
    return false;
  }
}
