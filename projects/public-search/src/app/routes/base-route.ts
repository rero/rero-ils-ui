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

import { UrlSegment } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscriber } from 'rxjs';

export class BaseRoute {

  /**
   * Constructor
   * @param _translateService - TranslateService
   */
  protected constructor(
    protected _translateService: TranslateService
  ) {}

  /**
   * Route matcher
   * @param url - any
   * @param types - array of string
   */
  protected routeMatcher(url: any, types: Array<string>) {
    const urlType = url.slice(-1).pop();
    if (types.some(x => x === urlType.path)) {
      return this.matchedUrl(url);
    }
    return null;
  }

  /**
   * Matched url
   * @param url - array of UrlSegment
   */
  private matchedUrl(url: UrlSegment[]) {
    const segments = [
      new UrlSegment(url[0].path, {}),
      new UrlSegment(url[1].path, {}),
      new UrlSegment(url[2].path, {})
    ];
    return {
      consumed: segments,
      posParams: { type: new UrlSegment(url[2].path, {}) }
    };
  }

  /**
   * Filter aggregations
   *
   * @return Observable
   */
  protected aggFilter(aggregations: object): Observable<any> {
    const obs = new Observable((observer: Subscriber<any>): void => {
      observer.next(this.aggregationFilter(aggregations));
      this._translateService.onLangChange.subscribe(() => {
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
        if (this._translateService.currentLang === splitted[1]) {
          aggs[aggregation] = aggregations[aggregation];
        }
      } else {
        aggs[aggregation] = aggregations[aggregation];
      }
    });
    return aggs;
  }
}
