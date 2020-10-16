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

import { Pipe, PipeTransform } from '@angular/core';
import { SharedConfigService } from '../service/shared-config.service';

@Pipe({
  name: 'contributionType'
})
export class ContributionTypePipe implements PipeTransform {

  /**
   * Constructor
   * @param _sharedConfig - SharedConfigService
   */
  constructor(private _sharedConfig: SharedConfigService) {}

  /**
   * Transform
   * @param type - string, Type of agent
   * @return string, type of link
   * @throws Error on missing type
   */
  transform(type: string): any {
    const configType = this._sharedConfig.contributionAgentTypes[type];
    if (configType) {
      return configType;
    }
    throw new Error('Missing contribution type');
  }

}
