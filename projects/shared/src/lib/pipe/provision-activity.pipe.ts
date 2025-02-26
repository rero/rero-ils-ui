/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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

export enum ProvisionActivityType {
  PUBLICATION = 'bf:Publication',
  MANUFACTURE = 'bf:Manufacture',
  PRODUCTION = 'bf:Production',
  DISTRIBUTION = 'bf:Distribution'
}

@Pipe({
    name: 'provisionActivity',
    standalone: false
})
export class ProvisionActivityPipe implements PipeTransform {

  /**
   * extract the provision activity from the document metadata
   * @param metadata: the document metadata (as `getRecord` with resolve=1)
   * @param type: the type of provision to display. 'publication' by default
   * @return string: Return the provision activity text corresponding to the requested `type`. `null` if not found
   */
  transform(metadata: any, type = ProvisionActivityType.PUBLICATION): any {
    let provisionActivities = metadata.provisionActivity || [];
    provisionActivities = provisionActivities.filter(activity => activity.type === type && activity._text);
    // TODO : do better with '_text' using the current language tag
    return (provisionActivities.length > 0 )
      ? provisionActivities.pop()._text[0].value
      : null;
  }

}
