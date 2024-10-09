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
import { inject } from '@angular/core';
import { ApiService } from '@rero/ng-core';

export class Settings {

  private apiService: ApiService = inject(ApiService);

  /** Current circulation policy  */
  private circulationPolicy: any;

  /** Current circulation policy Matching */
  private circulationMatching = [];

  /** Matching patronType / itemType */
  private matching = [];

  /** Settings */
  private settings = [];

  /**
   * Set Circulation policy
   * @param circulationPolicy - Current Circulation Policy
   * @return this
   */
  setCirculationPolicy(circulationPolicy: any): this {
    this.circulationPolicy = circulationPolicy;
    return this;
  }

  /**
   * Create structure
   * @param itemTypes - array of item types
   * @param patronTypes - array of patron types
   * @param circPolicies - array of circulation policies
   * @param appliedToLibraries - the libraries for which the policy applied.
   * @return this
   */
  createStructure(itemTypes: any[], patronTypes: any[], circPolicies: any[], appliedToLibraries: any[]): this {
    if ('settings' in this.circulationPolicy) {
      this.circulationMatching = this._processSettings(this.circulationPolicy.settings, []);
    }
    const appliedToLibrariesPids = appliedToLibraries.map(uri => uri.substring(uri.lastIndexOf('/') + 1));
    this._processCirculationPolicies(circPolicies, appliedToLibrariesPids);
    itemTypes.forEach(itemType => {
      const item = {
        pid: itemType.metadata.pid,
        label: itemType.metadata.name,
        value: this.apiService.getRefEndpoint('item_types', itemType.metadata.pid),
        patronTypes: []
      };
      patronTypes.forEach(patronType => {
        const key: string = (`${itemType.metadata.pid}-${patronType.metadata.pid}`).toString();
        item.patronTypes.push({
          pid: patronType.metadata.pid,
          label: patronType.metadata.name,
          value: this.apiService.getRefEndpoint('patron_types', patronType.metadata.pid),
          checked: this.circulationMatching.some(e => e === key),
          disabled: this.matching.some(e => e === key)
        });
      });
      this.settings.push(item);
    });
    return this;
  }

  /**
   * Get structure
   * @return array of settings
   */
  getStructure(): any[] {
    return this.settings;
  }

  /**
   * Process Circulation policies
   * @param circPolicies - array of circulation policies.
   * @param appliedToLibraries - the libraries for which the policy applied.
   */
  private _processCirculationPolicies(circPolicies: any[], appliedToLibraries: any[]): void {
    circPolicies.forEach(policy => {
      if ('settings' in policy.metadata) {

        // Library level control
        //   * Check if `policy` applied on libraries ?
        //   * If yes, if some `policyLibraries` exists into `appliedToLibraries`
        //   * If no --> skip this policy
        if (policy.metadata.hasOwnProperty('libraries')) {
          const policyLibraryPids = policy.metadata.libraries.map(lib => lib.pid);
          if (!policyLibraryPids.some(pid => appliedToLibraries.includes(pid))) {
            return;  // Skip the policy
          }
        }

        this.matching = this.matching.concat(
          this._processSettings(policy.metadata.settings, this.matching)
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
