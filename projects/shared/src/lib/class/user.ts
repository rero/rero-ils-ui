/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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

import { PERMISSIONS } from "../util/permissions";

export class User implements IUser {

  /** Logged user API url */
  static readonly LOGGED_URL = '/patrons/logged_user?resolve';

  id: number;
  pid?: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  username: string;
  street?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  home_phone?: string;
  business_phone?: string;
  mobile_phone?: string;
  other_phone?: string;
  keep_history: boolean;
  email?: string;
  roles: string[] = [];
  patrons?: IPatron[] = [];
  permissions: string[];

  /** private _isLogged */
  private _isAuthenticated = false;

  /** Display Patron Mode */
  private _displayPatronMode = true;

  /** Current library */
  private _currentLibrary?: string;

  /** Current organisation */
  private _currentOrganisation?: string;

  /** Current budget for the organisation */
  currentBudget?: string;

  /** Librarian (patron record) */
  private _patronLibrarian?: IPatron;

  /** User symbol name (2 letters) */
  private _symbolName: string;

  /** All patron roles */
  private _patronRoles: string[];

  /**
   * Is authenticated
   * @return boolean
   */
  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  /**
   * Set display patron mode
   * @param mode - boolean
   */
  set displayPatronMode(mode: boolean) {
    this._displayPatronMode = mode;
  }

  /**
   * Get display patron mode
   * @return boolean
   */
  get displayPatronMode(): boolean {
    return this._displayPatronMode;
  }

  /**
   * Is granted to access to admin UI
   * @return boolean
   */
  get hasAdminUiAccess(): boolean {
    return this.permissions.includes(PERMISSIONS.UI_ACCESS);
  }

  /**
   * Get patron record librarian
   * @return IPatron
   */
  get patronLibrarian(): IPatron {
    return this._patronLibrarian;
  }

  /**
   * Get user symbol name (2 letters)
   * @return string
   */
  get symbolName(): string {
    return this._symbolName;
  }

  /**
   * Is the user a patron
   * @return boolean
   */
  get isPatron(): boolean {
    return this.patrons?.some((patron: IPatron) => 'patron' in patron);
  }

  /**
   * Set current library
   * @param library - string
   */
  set currentLibrary(library: string) {
    this._currentLibrary = library;
  }

  /**
   * Get current library
   * @return string
   */
  get currentLibrary(): string {
    return this._currentLibrary;
  }

  /**
   * Set current organisation
   * @param organisation - string
   */
  set currentOrganisation(organisation: string) {
    this._currentOrganisation = organisation;
  }

  /**
   * Get current organisation
   * @retun string
   */
  get currentOrganisation(): string {
    return this._currentOrganisation;
  }

  /**
   * Get all patrons roles
   * @return array of role
   */
  get patronRoles(): string[] {
    return this._patronRoles;
  }

  /**
   * Constructor
   * @param user - object | User
   */
  constructor(user: any) {
    // Check if the user is authenticated
    // by looking if keys exist in the object
    const keys = Object.keys(user);
    if (keys.length > 0) {
      this._isAuthenticated = keys.includes('username');
      this._initialize(user);
    }
  }

  /**
   * Get patron by organisation pid
   * @param pid - string
   * @return IPatron or undefined
   */
   getPatronByOrganisationPid(pid: string): IPatron | undefined {
    if (this.patrons && this.patrons.length > 0) {
      const patrons = this.patrons.filter(
        (patron: IPatron) => patron.organisation.pid === pid
      );
      return (patrons.length === 1) ? patrons[0] : undefined;
    }
    return undefined;
  }

  /**
   * Check if the user has specific roles.
   * @param roles: array of role to check
   * @param operator: If 'and', then the user need to have all requested roles.
   *                  If 'or', then the user need to have at least one of requested roles.
   * @return boolean
   */
   hasRoles(roles: string[], operator: 'and' | 'or' = 'and'): boolean {
    const intersection = roles.filter(role => this._patronRoles.includes(role));
    return (operator === 'and')
      ? intersection.length === roles.length  // all requested roles are present into user roles.
      : intersection.length > 0; // at least one requested roles are present into user roles.
  }

  /**
   * Initialize user object
   * @param user - IUser
   */
  private _initialize(user: IUser): void {
    Object.assign(this, user);
    this._patronLibrarian = this._extractLibrarian();
    this._symbolName = this._generateSymbolName();
    this._patronRoles = this._extractPatronRoles();
  }

  /**
   * Extract librarian (patron record)
   * @return IPatron or undefined
   */
  private _extractLibrarian(): IPatron | undefined {
    const patrons = this.patrons.filter((patron: IPatron) => {
      if (patron.libraries?.length > 0) {
        return patron;
      }
    });
    return patrons.length > 0 ? patrons[0] : undefined;
  }

  /**
   * Generate Symbol name
   * @returns initials of the connected user
   */
   private _generateSymbolName(): string {
    // If user isn't connected return 'AN' for 'Anonymous user'
    if (!this.first_name && !this.last_name) {
      return 'AN';
    }
    return (this.first_name)
      ? (this.first_name[0]+this.last_name[0]).toUpperCase()
      : this.last_name.slice(0, 2).toUpperCase();
  }

  /**
   * Extract all roles for current user
   * @returns array of roles
   */
  private _extractPatronRoles() {
    let roles = [];
    this.patrons.forEach((patron: IPatron) => {
      roles = [...roles, ...patron.roles];
    });
    // Deduplicate roles
    return roles.filter((item, pos) => roles.indexOf(item) === pos).sort();
  }
}

/** Interface for user */
export type IUser = {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  username: string;
  street?: string;
  postal_code?: string;
  city?: string;
  country?: string;
  home_phone?: string;
  business_phone?: string;
  mobile_phone?: string;
  other_phone?: string;
  keep_history: boolean;
  email?: string;
  roles: string[];
  patrons?: IPatron[];
  permissions: string[]
}

/** Interface for patron */
export type IPatron = {
  pid: string;
  source?: string;
  local_code?: string;
  second_address?: {
    street?: string;
    postal_code?: string;
    city?: string;
    country?: string
  };
  patron?: {
    barcode: string[];
    type: IPatronType;
    expiration_date: Date;
    communication_channel: string;
    additional_communication_email?: string;
    communication_language: string;
    subscriptions?: {
      start_date: Date;
      end_date: Date;
      patron_type: {
        pid: string;
      };
      patron_transaction?: {
        pid: string;
      }
    };
    blocked?: boolean;
    blocked_note?: string;
    libraries?: ILibrary[];
    organisation?: IOrganisation;
  };
  libraries?: ILibrary[];
  organisation?: IOrganisation;
  roles: string[];
}

/** Interface for organisation */
export type IOrganisation = {
  pid: string;
  code?: string;
  name?: string;
  currency?: string;
  budget?: {pid: string};
}

/** Interface for library */
export type ILibrary = {
  pid: string;
  organisation: IOrganisation;
}

/** Interface for patron type */
export type IPatronType = {
  pid: string;
  type?: string;
}
