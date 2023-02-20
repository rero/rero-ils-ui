/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
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
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from '../service/app-settings.service';

@Pipe({
  name: 'contributionEntity'
})
export class ContributionEntityPipe implements PipeTransform {

  private _authorizedKey = 'authorized_access_point';
  /**
   * Constructor
   * @param _appSettingsService - AppSettingsService
   * @param _translateService - TranslateService
   */
    constructor(
      private _appSettingsService: AppSettingsService,
      private _translateService: TranslateService
    ) {}

  transform(
    contributions: any[],
    filters: string[] = ['bf:Person', 'bf:Organisation'],
    limit?: number
  ): EntityInterface {
    const result = { count: contributions.length, entries: []};
    contributions.filter(c => filters.includes(c.entity.type)).map(contrib => result.entries.push({
      authorizedAccessPoint: this._authorizedAccessPoint(contrib.entity),
      pid: contrib.entity?.pid,
      type: contrib.entity.type,
      roles: contrib.role.map((r: string) => this._translateService.instant(r)),
      target: this._traget(contrib.entity.type)
    }));
    if (limit) {
      result.entries = result.entries.slice(0, limit);
    }

    return result;
  }

  private _authorizedAccessPoint(entity: any): string {
    if (entity.pid) {
      // Mef
      const key = `${this._authorizedKey}_${this._translateService.currentLang}`;
      const fallbackKey = `${this._authorizedKey}_en`;
      return (key in entity) ? entity[key] : entity[fallbackKey];
    } else {
      // Local
      return entity[this._authorizedKey]
    }
  }

  private _traget(type: string): string | undefined {
    const entityTypes = this._appSettingsService.settings.contributionAgentTypes || {};

    return (type in entityTypes) ? entityTypes[type] : undefined;
  }
}

export interface EntityInterface {
  count: number,
  entries: {
    authorizedAccessPoint: string;
    pid: string | undefined;
    type: string;
    roles: string[];
    target: string | undefined;
  }[]
}
