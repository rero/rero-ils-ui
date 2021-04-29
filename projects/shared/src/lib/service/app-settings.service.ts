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
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppSettingsService {

  /** Application settings */
  private _settings: ISettings;

  /** Current view code */
  private _currentViewCode: string;

  /**
   * Set settings
   */
  set settings(config: ISettings) {
    this._settings = config;
  }

  /**
   * Get settings
   * @return ISettings
   */
  get settings(): ISettings {
    return this._settings;
  }

  /**
   * Set current view code
   * @param viewcode - string
   */
  set currentViewCode(viewcode: string) {
    this._currentViewCode = viewcode;
  }

  /**
   * Get current view code
   * @return string or undefined
   */
  get currentViewCode(): string | undefined {
    return this._currentViewCode;
  }

  /**
   * Get base url
   * @return string
   */
  get baseUrl(): string {
    this._checkSettings();
    return this._settings.baseUrl;
  }

  /**
   * Get contribution sources
   * @return array of string
   */
  get contributionSources(): string[] {
    this._checkSettings();
    return this._settings.contributionSources;
  }

  /**
   * Get contribution agent types
   * @return any
   */
  get contributionAgentTypes(): any {
    this._checkSettings();
    return this._settings.contributionAgentTypes;
  }

  /**
   * Get contribution order
   * @return array of order with fallback
   */
  get contributionsLabelOrder(): any {
    this._checkSettings();
    return this._settings.contributionsLabelOrder;
  }

  /**
   * Get global view code
   * @return string
   */
  get globalViewCode(): string {
    this._checkSettings();
    return this._settings.globalView;
  }

  /**
   * Get current language
   * @return string
   */
  get currentLanguage(): string {
    this._checkSettings();
    return this._settings.language;
  }

  /**
   * Get operation logs resources
   * @return any
   */
  get operationLogs(): any {
    this._checkSettings();
    return this._settings.operationLogs;
  }

  /**
   * Get librarian roles
   * @return array of roles
   */
  get librarianRoles(): string[] {
    this._checkSettings();
    return this._settings.librarianRoles;
  }

  /**
   * Check if the settings are present
   * @throw SettingsError
   */
  private _checkSettings(): void {
    if (!this._settings) {
      throw new SettingsError('Set settings before call function.');
    }
  }
}

/** Interface for settings */
export interface ISettings {
  baseUrl: string;
  contributionSources: string[];
  contributionAgentTypes: any;
  contributionsLabelOrder: any;
  globalView: string;
  language: string;
  operationLogs: any;
  librarianRoles: string[];
}

/** Settings Error */
class SettingsError extends Error {}
