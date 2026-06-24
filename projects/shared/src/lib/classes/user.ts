// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { PERMISSIONS } from "../util/permissions";

export class User {

  /** Logged user API url */
  static readonly LOGGED_URL = '/patrons/logged_user?resolve';

  readonly profile: IUserProfile;
  readonly patrons: IPatron[];
  readonly permissions: string[];

  private _isAuthenticated = false;
  private _displayPatronMode = true;
  private _currentLibrary?: string;
  private _currentOrganisation?: string;
  private _patronLibrarian?: IPatron;
  private _symbolName: string;
  private _patronRoles: string[];

  get id(): number {
    return this.profile.id;
  }

  get pid(): string | undefined {
    return this.profile.pid;
  }

  get keep_history(): boolean {
    return this.profile.keep_history;
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  set displayPatronMode(mode: boolean) {
    this._displayPatronMode = mode;
  }

  get displayPatronMode(): boolean {
    return this._displayPatronMode;
  }

  get hasAdminUiAccess(): boolean {
    return this.permissions.includes(PERMISSIONS.UI_ACCESS);
  }

  get patronLibrarian(): IPatron | undefined {
    return this._patronLibrarian;
  }

  get symbolName(): string {
    return this._symbolName;
  }

  get isPatron(): boolean {
    return this.patrons.some((patron: IPatron) => 'patron' in patron);
  }

  set currentLibrary(library: string) {
    this._currentLibrary = library;
  }

  get currentLibrary(): string | undefined {
    return this._currentLibrary;
  }

  set currentOrganisation(organisation: string) {
    this._currentOrganisation = organisation;
  }

  get currentOrganisation(): string | undefined {
    return this._currentOrganisation;
  }

  get patronRoles(): string[] {
    return this._patronRoles;
  }

  constructor({ user, patrons, permissions }: UserConstructorData) {
    this.profile = user;
    this.patrons = patrons;
    this.permissions = permissions;
    this._isAuthenticated = Boolean(user.username);
    this._patronLibrarian = this._extractLibrarian();
    this._symbolName = this._generateSymbolName();
    this._patronRoles = this._extractPatronRoles();
  }

  getPatronByOrganisationPid(pid: string): IPatron | undefined {
    return this.patrons.find(
      (patron: IPatron) => 'patron' in patron && patron.organisation?.pid === pid
    );
  }

  hasRoles(roles: string[], operator: 'and' | 'or' = 'and'): boolean {
    const intersection = roles.filter(role => this._patronRoles.includes(role));
    return operator === 'and'
      ? intersection.length === roles.length
      : intersection.length > 0;
  }

  private _extractLibrarian(): IPatron | undefined {
    return this.patrons.find((patron: IPatron) => (patron.libraries?.length ?? 0) > 0);
  }

  private _generateSymbolName(): string {
    const { first_name, last_name } = this.profile;
    if (!first_name && !last_name) {
      return 'AN';
    }
    return (first_name && last_name)
      ? (first_name[0] + last_name[0]).toUpperCase()
      : (first_name || last_name).slice(0, 2).toUpperCase();
  }

  private _extractPatronRoles(): string[] {
    const roles = this.patrons.flatMap((patron: IPatron) => patron.roles);
    return [...new Set(roles)].sort();
  }
}

export type UserConstructorData = {
  user: IUserProfile;
  patrons: IPatron[];
  permissions: string[];
};

export type IUserProfile = {
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
  roles: string[];
};

/** @deprecated Use IUserProfile */
export type IUser = IUserProfile & {
  patrons?: IPatron[];
  permissions: string[];
};

export type IPatron = {
  pid: string;
  source?: string;
  local_code?: string;
  second_address?: {
    street?: string;
    postal_code?: string;
    city?: string;
    country?: string;
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
      patron_type: { pid: string };
      patron_transaction?: { pid: string };
    };
    blocked?: boolean;
    blocked_note?: string;
    libraries?: ILibrary[];
    organisation?: IOrganisation;
  };
  libraries?: ILibrary[];
  organisation?: IOrganisation;
  roles: string[];
};

export type IOrganisation = {
  pid: string;
  code?: string;
  name?: string;
  currency?: string;
  budget?: { pid: string };
};

export type ILibrary = {
  pid: string;
  organisation: IOrganisation;
};

export type IPatronType = {
  pid: string;
  type?: string;
};
