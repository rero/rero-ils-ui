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
  displayPatronMode = true;
  currentLibrary: string;
  // When patron is blocked, add 'blocked' and 'blocked_note' fields.
  blocked = false;
  blocked_note: string;

  /** Locale storage name key */
  static readonly STORAGE_KEY = 'user';

  /** Logged user API url */
  static readonly LOGGED_URL = '/patrons/logged_user?resolve';

  /**
   * Constructor
   * @param user - Object
   */
  constructor(user: any) {
    Object.assign(this, user);
  }

  /**
   * Check if the user has a specific role
   * @param role: string the role to check
   * @return boolean: if the user has the requested role
   */
  hasRole(role: string) {
    return this.roles.includes(role);
  }

  /**
   * Check if the user has specific roles.
   * @param roles: array of role to check
   * @param operator: If 'and', then the user need to have all requested roles.
   *                  If 'or', then the user need to have at least one of requested roles.
   * @return boolean
   */
  hasRoles(roles: Array<string>, operator: string = 'and') {
    const intersection = roles.filter(role => this.roles.includes(role));
    return (operator === 'and')
      ? intersection.length == roles.length  // all requested roles are present into user roles.
      : intersection.length > 0 // at least one requested roles are present into user roles.
  }

  /**
   * Get All roles
   * @return array of roles
   */
  getRoles() {
    return this.roles ? this.roles : [];
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

  /**
   * Is this user a patron?
   * @return a boolean
   */
  get isPatron() {
    return this.hasRole('patron');
  }

  /**
   * Is this user a librarian?
   * @return a boolean
   */
  get isLibrarian() {
    return this.hasRole('librarian');
  }

}

export interface Organisation {
  pid: string;
  code?: string;
}

export interface Library {
  pid: string;
  organisation: Organisation;
}

export interface PatronType {
  pid: string;
  name?: string;
}
