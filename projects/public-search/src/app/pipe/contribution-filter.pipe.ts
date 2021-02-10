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
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contributionFilter'
})
export class ContributionFilterPipe implements PipeTransform {

  /**
   * Transform agent to extract access point for current language
   * @param contributions - array of contributions (agent)
   * @param language - current language interface
   * @return array of contributions
   */
  transform(contributions: any[], language: string = 'en'): any[] {
    const output = [];
    const key = `authorized_access_point_${language}`;
    if (contributions) {
      contributions.forEach(contribution => {
        const agent = contribution.agent;
        const accessPoint = (key in agent)
        ? agent[key]
        : agent.authorized_access_point_en;
        output.push({
          authorizedAccessPoint: accessPoint,
          pid: ('pid' in agent) ? agent.pid : undefined,
          type: agent.type,
          role: contribution.role,
          target: this._linkTarget(agent.type)
        });
      });
    }
    return output;
  }

  /**
   * Link Target
   * @param type - type of agent
   * @return target name
   */
  private _linkTarget(type: string): string {
    switch (type) {
      case 'bf:Person':
        return 'persons';
      case 'bf:Organisation':
        return 'corporate-bodies';
      default:
        return undefined;
    }
  }

}
