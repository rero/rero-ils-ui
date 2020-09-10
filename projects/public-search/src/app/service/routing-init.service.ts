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
import { Injectable } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { DetailComponent, RecordSearchComponent } from '@rero/ng-core';
import { Observable, of, Subscriber } from 'rxjs';
import { AppConfigService } from '../app-config.service';
import { DocumentBriefComponent } from '../document-brief/document-brief.component';
import { PersonBriefComponent } from '../person-brief/person-brief.component';


@Injectable({
  providedIn: 'root'
})
export class RoutingInitService {

  /**
   * Array of view code config
   */
  availableConfig: Array<string> = [];

  /**
   * Constructor
   *
   * @param _translateService - TranslateService
   */
  constructor(
    private _translateService: TranslateService,
    private _appConfigService: AppConfigService
  ) {}

  /**
   * Route Config
   *
   * @param viewcode - string
   */
  routeConfig(viewcode: string) {
    this.availableConfig.push(viewcode);
    return {
      path: `${viewcode}/search`,
      children: [
        { path: ':type', component: RecordSearchComponent },
        { path: ':type/detail/:pid', component: DetailComponent }
      ],
      data: {
        showSearchInput: false,
        adminMode: () => of({
          can: false,
          message: ''
        }),
        detailUrl: `/${viewcode}/:type/:pid`,
        types: [
          {
            key: _('documents'),
            component: DocumentBriefComponent,
            label: _('Documents'),
            aggregations: (aggregations: any) => this.filter(aggregations),
            aggregationsOrder: this.aggregations(viewcode),
            aggregationsExpand: ['document_type'],
            aggregationsBucketSize: 10,
            preFilters: {
              view: `${viewcode}`,
              simple: 1
            },
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            }
          },
          {
            key: _('persons'),
            component: PersonBriefComponent,
            label: _('Persons'),
            aggregationsExpand: ['sources'],
            listHeaders: {
              Accept: 'application/rero+json, application/json'
            },
            preFilters: {
              view: `${viewcode}`,
              simple: 1
            }
          }
        ]
      }
    };
  }

  /**
   * List of aggregations
   *
   * @param viewcode - viewcode
   */
  private aggregations(viewcode: string) {
    if (this._appConfigService.globalViewName === viewcode) {
      return [
        _('document_type'),
        _('author'),
        _('organisation'),
        _('language'),
        _('subject'),
        _('status')
      ];
    } else {
      return [
        _('document_type'),
        _('author'),
        _('library'),
        _('language'),
        _('subject'),
        _('status')
      ];
    }
  }

  /**
   * Filter aggregations
   *
   * @return Observable
   */
  private filter(aggregations: object): Observable<any> {
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
   * @return array of value
   */
  private aggregationFilter(aggregations: object) {
    // TODO replace organisation facet by library facet when the viewcode is not global (needs backend adaptation)
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
