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

/* tslint:disable */
// required as json properties is not lowerCamelCase
export class User {
  $schema: string;
  birth_date: string;
  city: string;
  email: string;
  first_name: string;
  is_patron: boolean;
  last_name: string;
  library: Library;
  name: string;
  phone: string;
  pid: string;
  circulation_location_pid?: string;
  postal_code: string;
  roles: string[];
  street: string;
  organisation_pid: string;
  barcode?: string;
  items?: any[];
  patron_type?: PatronType;
  currentLibrary: string;

  static readonly STORAGE_KEY = 'user';

  static readonly LOGGED_URL = '/patrons/logged_user?resolve';

  /**
   * Constructor
   * @param user - Object
   */
  constructor(user: any) {
    Object.assign(this, user);
  }

  /**
   * Check if you are an access ton admin interface
   * @param roles - arrays of role
   */
  isAuthorizedAdminAccess(roles: Array<string>) {
    return this.roles.filter((role: string) => {
      if (roles.indexOf(role) > -1) {
        return role;
      }
    }).length > 0;
  }

  /**
   * Has the role
   * @param role - string
   */
  hasRole(role: string) {
    return this.roles.includes(role);
  }

  /**
   * Has roles
   * @param roles - array of role
   */
  hasRoles(roles: Array<string>) {
    let hasRole = false;
    roles.forEach(role => {
      if (!hasRole && this.roles.includes(role)) {
        hasRole = true;
      }
    });
    return hasRole;
  }

  /**
   * Set current library pid
   * @param pid - string
   */
  setCurrentLibrary(pid: string) {
    this.currentLibrary = pid;
  }

  /**
   * Get current Library
   * @return pid - string
   */
  getCurrentLibrary() {
    return this.currentLibrary;
  }
}

export interface Organisation {
  pid: string;
}

export interface Library {
  pid: string;
  organisation: Organisation;
}

export interface PatronType {
  pid: string;
  name?: string;
}
