/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscriber } from 'rxjs';

export class AggregationFilter {

  static translateService: TranslateService;

  static filter(aggregations: object): Observable<any> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      observer.next(AggregationFilter.aggregationFilter(aggregations));
      AggregationFilter.translateService.onLangChange.subscribe(() => {
        observer.next(AggregationFilter.aggregationFilter(aggregations));
      });
    });
    return obs;
  }

  static aggregationFilter(aggregations: object) {
    const aggs = {};
    Object.keys(aggregations).forEach(aggregation => {
      if (aggregation.indexOf('__') > -1) {
        const splitted = aggregation.split('__');
        if (AggregationFilter.translateService.currentLang === splitted[1]) {
          aggs[splitted[0]] = aggregations[aggregation];
        }
      } else {
        aggs[aggregation] = aggregations[aggregation];
      }
    });
    return aggs;
  }
}
