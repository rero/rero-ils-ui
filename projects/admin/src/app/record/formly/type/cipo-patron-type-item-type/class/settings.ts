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
import { ApiService } from '@rero/ng-core';

export type HitRecord = {
  metadata: {
    pid: string;
    name: string;
    libraries?: { pid: string }[];
    [key: string]: unknown;
  };
};

export type PatronTypeRow = {
  pid: string;
  label: string;
  value: string;
  checked: boolean;
  disabled: boolean;
};

export type SettingsRow = {
  pid: string;
  label: string;
  value: string;
  patronTypes: PatronTypeRow[];
};

type RawSetting = {
  item_type: { $ref?: string; pid?: string };
  patron_type: { $ref?: string; pid?: string };
};

type CirculationPolicyValue = {
  settings?: RawSetting[];
  [key: string]: unknown;
};

export class Settings {

  /** Current circulation policy */
  private circulationPolicy: CirculationPolicyValue = {};

  /** Current circulation policy matching */
  private circulationMatching: string[] = [];

  /** Matching patronType / itemType keys already used by other policies */
  private matching: string[] = [];

  /** Settings */
  private settings: SettingsRow[] = [];

  constructor(private apiService: ApiService) {}

  /**
   * Set Circulation policy
   * @param circulationPolicy - Current Circulation Policy
   * @return this
   */
  setCirculationPolicy(circulationPolicy: CirculationPolicyValue): this {
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
  createStructure(itemTypes: HitRecord[], patronTypes: HitRecord[], circPolicies: HitRecord[], appliedToLibraries: string[]): this {
    if (this.circulationPolicy.settings) {
      this.circulationMatching = this._processSettings(this.circulationPolicy.settings, []);
    }
    const appliedToLibraryPids = appliedToLibraries.map(uri => uri.substring(uri.lastIndexOf('/') + 1));
    this._processCirculationPolicies(circPolicies, appliedToLibraryPids);
    itemTypes.forEach(itemType => {
      const item: SettingsRow = {
        pid: itemType.metadata.pid,
        label: itemType.metadata.name,
        value: this.apiService.getRefEndpoint('item_types', itemType.metadata.pid),
        patronTypes: []
      };
      patronTypes.forEach(patronType => {
        const key = `${itemType.metadata.pid}-${patronType.metadata.pid}`;
        item.patronTypes.push({
          pid: patronType.metadata.pid,
          label: patronType.metadata.name,
          value: this.apiService.getRefEndpoint('patron_types', patronType.metadata.pid),
          checked: this.circulationMatching.includes(key),
          disabled: this.matching.includes(key)
        });
      });
      this.settings.push(item);
    });
    return this;
  }

  /**
   * Get structure
   * @return array of settings rows
   */
  getStructure(): SettingsRow[] {
    return this.settings;
  }

  /**
   * Process Circulation policies
   * @param circPolicies - array of circulation policies.
   * @param appliedToLibraries - the library pids for which the policy applied.
   */
  private _processCirculationPolicies(circPolicies: HitRecord[], appliedToLibraries: string[]): void {
    circPolicies.forEach(policy => {
      if (!('settings' in policy.metadata)) {
        return;
      }
      // Library level control: skip this policy if none of its libraries overlap
      // with the currently selected libraries.
      if (policy.metadata.libraries) {
        const policyLibraryPids = policy.metadata.libraries.map(lib => lib.pid);
        if (!policyLibraryPids.some(pid => appliedToLibraries.includes(pid))) {
          return;
        }
      }
      this.matching = this.matching.concat(
        this._processSettings(policy.metadata.settings as RawSetting[], this.matching)
      );
    });
  }

  /**
   * Process settings
   * @param settings - array of raw settings
   * @param matching - already matched keys
   * @return array of new `itemTypePid-patronTypePid` keys
   */
  private _processSettings(settings: RawSetting[], matching: string[]): string[] {
    const output: string[] = [];
    const regexPid = /.+\/(.+)$/;
    settings.forEach(setting => {
      const itemTypePid = setting.item_type.$ref
        ? regexPid.exec(setting.item_type.$ref)![1]
        : setting.item_type.pid!;
      const patronTypePid = setting.patron_type.$ref
        ? regexPid.exec(setting.patron_type.$ref)![1]
        : setting.patron_type.pid!;
      const key = `${itemTypePid}-${patronTypePid}`;
      if (!matching.includes(key)) {
        output.push(key);
      }
    });
    return output;
  }
}
