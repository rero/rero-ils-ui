/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * This pipe get the best possible label about a RERO `Entity` depending on the language used
 * by the current logged user. By preference: the current language access point is used, if
 * not the english access point and finally the default access point.
 * If this entity has subdivisions, the access point of these subdivisions will be added to
 * the final label (subdivision doesn't
 *
 * For example, if the current language is 'es' and entity data are :
 *
 *   {
 *     'authorized_access_point_it': 'italian label',
 *     'authorized_access_point': 'default label',
 *     'subdivisions': [
 *       {'entity': {
 *           'authorized_access_point_es': 'part1_es',
 *           'authorized_access_point': 'part1'
 *       }},
 *       {'entity': {
 *           'authorized_access_point': 'part2'
 *       }},
 *     ]
 *   }
 *
 * output will be : "default label - part1_es - part2"
 *
 */
@Pipe({
  name: 'entityLabel'
})
export class EntityLabelPipe implements PipeTransform {

  protected translateService: TranslateService = inject(TranslateService);

  // PIPE ATTRIBUTES ==========================================================
  /** the basic key where to find the entity label */
  private _authorizedKey = 'authorized_access_point';
  /** the separator to use to glue all parts of the label. */
  private _defaultPartSeparator = ' - '

  // PIPE METHODS =============================================================
  /**
   * Pipe transformation method.
   *   Get the best possible entity label depending on the current locale language used.
   *   If entity has some `subdivisions` parts, they will be joined using after the main label.
   * @param entity - the entity to display
   * @param partSeparator - the glue string to use to join parts
   * @return the entity label
   */
  transform(entity: any, partSeparator: string = this._defaultPartSeparator): string {
    const parts: Array<string> = []
    const currentLangKey = `${this._authorizedKey}_${this.translateService.currentLang}`;
    const fallbackLangKey = `${this._authorizedKey}_en`;
    parts.push(entity[currentLangKey] || entity[fallbackLangKey] || entity[this._authorizedKey]);
    if (entity?.subdivisions) {
      entity.subdivisions.forEach(sub => parts.push(
        sub.entity[currentLangKey] || sub.entity[fallbackLangKey] || sub.entity[this._authorizedKey]
      ));
    }
    return parts
      .filter(part => part)  // filter array removing "null|undefined|false" values
      .join(partSeparator);  // glue all parts to return a simple string
  }

}
