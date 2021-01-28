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
import { ApiService } from '@rero/ng-core';

export class Settings {

  /** Current circulation polic  */
  private _circulationPolicy: any;

  /** Current circulation policy Matching */
  private _circulationMatching = [];

  /** Matching patronType / itemType */
  private _matching = [];

  /** Settings */
  private _settings = [];

  /**
   * Constructor
   * @param _apiService - ApiService
   */
  constructor(private _apiService: ApiService) {}

  /**
   * Set Circulation policy
   * @param circulationPolicy - Current Circulation Policy
   * @return this
   */
  setCirculationPolicy(circulationPolicy: any): this {
    this._circulationPolicy = circulationPolicy;
    return this;
  }

  /**
   * Create structure
   * @param itemTypes - array of item types
   * @param patronTypes - array of patron types
   * @param circPolicies - array of circulation policies
   * @return this
   */
  createStructure(itemTypes: any[], patronTypes: any[], circPolicies: any[]): this {
    if ('settings' in this._circulationPolicy) {
      this._circulationMatching = this._processSettings(this._circulationPolicy.settings, []);
    }
    this._processCirculationPolicies(circPolicies);
    itemTypes.forEach(itemType => {
      const item = {
        pid: itemType.metadata.pid,
        label: itemType.metadata.name,
        value: this._apiService.getRefEndpoint('item_types', itemType.metadata.pid),
        patronTypes: []
      };
      patronTypes.forEach(patronType => {
        const key: string = (`${itemType.metadata.pid}-${patronType.metadata.pid}`).toString();
        item.patronTypes.push({
          pid: patronType.metadata.pid,
          label: patronType.metadata.name,
          value: this._apiService.getRefEndpoint('patron_types', patronType.metadata.pid),
          checked: this._circulationMatching.some(e => e === key),
          disabled: this._matching.some(e => e === key) ? true : false
        });
      });
      this._settings.push(item);
    });
    return this;
  }

  /**
   * Get structure
   * @return array of settings
   */
  getStructure(): any[] {
    return this._settings;
  }

  /**
   * Process Circulation policies
   * @param circPolicies - array of circulation policies
   */
  private _processCirculationPolicies(circPolicies: any[]): void {
    circPolicies.forEach(policy => {
      if ('settings' in policy.metadata) {
        this._matching = this._matching.concat(
          this._processSettings(policy.metadata.settings, this._matching)
        );
      }
    });
  }

  /**
   * Process settings
   * @param settings - array
   * @param matching - array
   * @return array of settings
   */
  private _processSettings(settings: any[], matching: any[]): string[] {
    const output = [];
    const regexPid = /.+\/(.+)$/;
    settings.forEach(setting => {
      const itemTypePid = ('$ref' in setting.item_type)
        ? regexPid.exec(setting.item_type.$ref)[1]
        : setting.item_type.pid;
      const patronTypePid = ('$ref' in setting.patron_type)
        ? regexPid.exec(setting.patron_type.$ref)[1]
        : setting.patron_type.pid;
      const key = `${itemTypePid}-${patronTypePid}`;
      if (!(key in matching)) {
        output.push(key);
      }
    });
    return output;
  }
}
