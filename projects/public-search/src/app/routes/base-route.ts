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

import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscriber } from 'rxjs';

export class BaseRoute {

  protected translateService: TranslateService = inject(TranslateService);

  /**
   * Filter aggregations
   *
   * @return Observable
   */
  protected aggFilter(aggregations: object): Observable<any> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      observer.next(this.aggregationFilter(aggregations));
      this.translateService.onLangChange.subscribe(() => {
        observer.next(this.aggregationFilter(aggregations));
      });
    });
    return obs;
  }

  /**
   * Aggregation filter
   *
   * @param aggregations, object
   * @return array of value
   */
  private aggregationFilter(aggregations: object) {
    /*
      TODO: replace organisation facet by library facet
      when the viewcode is not global (needs backend adaptation)
    */
    const aggs = {};
    Object.keys(aggregations).forEach(aggregation => {
      if (aggregation.indexOf('__') > -1) {
        const splitted = aggregation.split('__');
        if (this.translateService.currentLang === splitted[1]) {
          aggs[aggregation] = aggregations[aggregation];
        }
      } else {
        aggs[aggregation] = aggregations[aggregation];
      }
    });
    return aggs;
  }
}
