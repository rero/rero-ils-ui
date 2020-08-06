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
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'contributionFormat'
})
export class ContributionFormatPipe implements PipeTransform {

  /** field name prefix for access point */
  private accessPoint = 'authorized_access_point';

  /**
   * Constructor
   * @param translate - TranslateService
   */
  constructor(private translate: TranslateService) {}

  /**
   * @param contribution - Object
   * @param withRole - Flag to add role(s) after agent
   * @param fallbackLanguage - default language if the value isn't found
   * @return string
   */
  transform(contribution: any, withRole = false, fallbackLanguage = 'fr'): any {
    let agent = null;
    if (contribution.agent) {
      agent = this._transformAgent(contribution.agent, fallbackLanguage);
      if ('role' in contribution && withRole) {
        agent += ' ' + this._transformRole(contribution.role);
      }
    }

    return agent;
  }

  /**
   * Transform Person
   * @param agent - Agent
   * @param fallbackLanguage - Default language
   * @return string
   */
  private _transformAgent(agent: any, fallbackLanguage = null) {
    let result = null;
    const agentIndexName = `${this.accessPoint}_${this.translate.currentLang}`;
    const agentfallback = `${this.accessPoint}_${fallbackLanguage}`;
    if (agentIndexName in agent) {
      result = agent[agentIndexName];
    } else if (agentfallback in agent) {
      result = agent[agentfallback];
    } else if ('preferred_name' in agent) {
      result = agent.preferred_name;
    }
    return result;
  }

  /**
   * Transform Role
   * @param agentRole - Agent role(s)
   * @return string
   */
  private _transformRole(agentRole: any) {
    const roles = [];
    agentRole.map((role: string) => {
      roles.push(this.translate.instant(role));
    });
    if (roles.length > 0) {
      return `<span class="text-secondary">(${roles.join(', ')})<span>`;
    }
    return null;
  }
}
