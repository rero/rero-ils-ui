/*
 * RERO ILS UI
 * Copyright (C) 2023 RERO
 * Copyright (C) 2023 UCLouvain
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
  name: 'identifiedByLabel'
})
export class IdentifiedByLabelPipe implements PipeTransform {

  /** the separator to use to glue all parts of the label. */
  private _defaultSeparator = ', '

  /**
   * Pipe transformation method.
   *   Format identifiedBy as a string.
   * @param identifiedBy - the list of identifiedBy to display
   * @param types - list of type used to filter identifier
   * @param separator - the glue string to use to join parts
   * @return the entity label
   */
  transform(identifiedBy: any[], types: string[], separator: string = this._defaultSeparator): string | null {
    const identifiers: Array<any> = types
      ? identifiedBy.filter(identifier => types.includes(identifier.type))
      : identifiedBy;
    return identifiers
      ? identifiers.map(data => data.value).join(separator)
      : null;
  }
}
