/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
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
  private appSettings: ISettings;

  /** Current view code */
  private appCurrentViewCode: string;

  /**
   * Set settings
   */
  set settings(config: ISettings) {
    this.appSettings = config;
  }

  /**
   * Get settings
   * @return ISettings
   */
  get settings(): ISettings {
    return this.appSettings;
  }

  /**
   * Set current view code
   * @param viewcode - string
   */
  set currentViewCode(viewcode: string) {
    this.appCurrentViewCode = viewcode;
  }

  /**
   * Get current view code
   * @return string or undefined
   */
  get currentViewCode(): string | undefined {
    return this.appCurrentViewCode;
  }

  /**
   * Get base url
   * @return string
   */
  get baseUrl(): string {
    this._checkSettings();
    return this.appSettings.baseUrl;
  }

  /**
   * Get contribution sources
   * @return array of string
   */
  get agentSources(): string[] {
    this._checkSettings();
    return this.appSettings.agentSources;
  }

  /**
   * Get contribution agent types
   * @return any
   */
  get agentAgentTypes(): any {
    this._checkSettings();
    return this.appSettings.agentAgentTypes;
  }

  /**
   * Get contribution order
   * @return array of order with fallback
   */
  get agentLabelOrder(): any {
    this._checkSettings();
    return this.appSettings.agentLabelOrder;
  }

  /**
   * Get global view code
   * @return string
   */
  get globalViewCode(): string {
    this._checkSettings();
    return this.appSettings.globalView;
  }

  /**
   * Get current language
   * @return string
   */
  get currentLanguage(): string {
    this._checkSettings();
    return this.appSettings.language;
  }

  /**
   * Get operation logs resources
   * @return any
   */
  get operationLogs(): any {
    this._checkSettings();
    return this.appSettings.operationLogs;
  }

  /**
   * Check if the settings are present
   * @throw SettingsError
   */
  private _checkSettings(): void {
    if (!this.appSettings) {
      throw new SettingsError('Set settings before call function.');
    }
  }
}

/** Interface for settings */
export interface ISettings {
  baseUrl: string;
  agentSources: string[];
  agentAgentTypes: any;
  agentLabelOrder: any;
  globalView: string;
  language: string;
  operationLogs: any;
  documentAdvancedSearch: boolean;
  userProfile: {
    readOnly: boolean;
    readOnlyFields: string[]
  };
}

/** Settings Error */
class SettingsError extends Error {}
