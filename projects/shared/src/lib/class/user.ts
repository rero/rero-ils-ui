/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
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

import { marker } from '@biesbjerg/ngx-translate-extract-marker';

export function _(str: any) {
  return marker(str);
}

// required as json properties is not lowerCamelCase
/* tslint:disable */
export class User {
  $schema: string;
  username: string;
  birth_date: string;
  city: string;
  email?: string;
  first_name: string;
  last_name: string;
  libraries: Library[];
  name: string;
  phone: string;
  pid: string;
  circulation_location_pid?: string;
  postal_code: string;
  roles: string[];
  street: string;
  user_id: string;
  patron: {
    barcode: string,
    type: PatronType,
    communication_channel: string,
    communication_language: string,
    expiration_date: string,
    libraries?: Array<Library>,
    // When patron is blocked, add 'blocked' and 'blocked_note' fields.
    blocked?: false,
    blocked_note?: string
  };
  notes?: Array<{
    type: UserNoteType,
    content: string
  }>;
  items?: any[];
  displayPatronMode = true;
  currentLibrary: string;
  currentOrganisation: string;
  circulation_informations: {
    messages: Array<{type: string, content: string}>,
    statistics: any;
  }

  /** Locale storage name key */
  static readonly STORAGE_KEY = 'user';

  /** Logged user API url */
  static readonly LOGGED_URL = '/patrons/logged_user?resolve';

  /**
   * Is this user a librarian?
   * @return a boolean
   */
  get isLibrarian() {
    return this.hasRole('librarian');
  }

  /**
   * Is this user a system librarian
   * @return a boolean
   */
  get isSystemLibrarian() {
    return this.hasRole('system_librarian');
  }

  /**
   * Is this user a patron?
   * @return a boolean
   */
  get isPatron() {
    return this.hasRole('patron');
  }

  /**
   * Organisation
   * @return string, pid of current organisation
   */
  get organisation() {
    return this.getCurrentOrganisation();
  }

  /**
   * Set organisation
   * @param organisation - string or null, pid of organisation
   */
  set organisation(organisation: null | string) {
    this.currentOrganisation = organisation;
  }

  /**
   * Constructor
   * @param user - any
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
    const intersection = roles.filter(role => this.getRoles().includes(role));
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
    return this;
  }

  /**
   * Get current Library
   * @return pid - string
   */
  getCurrentLibrary() {
    return this.currentLibrary;
  }

  /**
   * Set current organisation
   * @param pid - string
   */
  setCurrentOrganisation(pid: string) {
    this.currentOrganisation = pid;
    return this;
  }

  /**
   * Get current organisation pid
   * @return pid - string
   */
  getCurrentOrganisation() {
    return this.currentOrganisation;
  }

  /**
   * Increment a circulation statistic for this user.
   * @param type - string: the statistic type (pending, request, loans, ...)
   * @param idx - number: the number to increment.
   * @return the new statistic counter
   */
  incrementCirculationStatistic(type: string, idx: number = 1): number {
    this.circulation_informations = this.circulation_informations || {messages: [], statistics: {}};
    this.circulation_informations.statistics[type] = (this.circulation_informations.statistics[type] || 0) + idx;
    return this.circulation_informations.statistics[type];
  }

  /**
   * Decrement a circulation statistic for this user.
   * @param type - string: the statistic type (pending, request, loans, ...)
   * @param idx - number: the number to decrement.
   * @return the new statistic counter
   */
  decrementCirculationStatistic(type: string, idx: number = 1): number {
    this.circulation_informations = this.circulation_informations || {messages: [], statistics: {}};
    if (!(type in this.circulation_informations.statistics)) {
      return 0;
    }
    const new_stat = this.circulation_informations.statistics[type] - idx;
    this.circulation_informations.statistics[type] = (new_stat > 0)
      ? new_stat
      : 0;
    return this.circulation_informations.statistics[type];
  }

  /**
   * Append a circulation message for this user.
   * @param message: the message to append
   */
  addCirculationMessage(message: {type: string, content: string}) {
    this.circulation_informations = this.circulation_informations || {messages: [], statistics: {}};
    this.circulation_informations.messages.push(message);
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

export enum UserNoteType {
  PUBLIC = _('public_note'),
  STAFF = _('staff_note')
}
