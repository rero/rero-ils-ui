// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Pipe, PipeTransform } from '@angular/core';

export enum ProvisionActivityType {
  PUBLICATION = 'bf:Publication',
  MANUFACTURE = 'bf:Manufacture',
  PRODUCTION = 'bf:Production',
  DISTRIBUTION = 'bf:Distribution'
}

@Pipe({ name: 'provisionActivity' })
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
    return (provisionActivities.length > 0)
      ? provisionActivities.pop()._text[0].value
      : null;
  }
}
