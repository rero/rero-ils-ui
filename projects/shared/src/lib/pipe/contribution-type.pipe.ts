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
import { AppSettingsService } from '../service/app-settings.service';

@Pipe({
  name: 'contributionType'
})
export class ContributionTypePipe implements PipeTransform {

  /**
   * Constructor
   * @param _appSettingsService - AppSettingsService
   */
  constructor(private _appSettingsService: AppSettingsService) {}

  /**
   * Transform
   * @param type - string, Type of agent
   * @return string, type of link
   * @throws Error on missing type
   */
  transform(type: string): any {
    const configType = this._appSettingsService.agentAgentTypes[type];
    if (configType) {
      return configType;
    }
    throw new Error('Missing contribution type');
  }

}
