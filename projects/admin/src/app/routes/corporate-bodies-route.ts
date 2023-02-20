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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DetailComponent, RecordSearchPageComponent, RouteInterface } from '@rero/ng-core';
import { of } from 'rxjs';
import { ContributionBriefComponent } from '@rero/shared';
import { ContributionDetailViewComponent } from '../record/detail-view/contribution-detail-view/contribution-detail-view.component';
import { BaseRoute } from './base-route';

export class CorporateBodiesRoute extends BaseRoute implements RouteInterface {

  /** Route name */
  readonly name = 'corporate-bodies';

  /** Sort initial configuration */
  private _options = [
    {
      label: _('Relevance'),
      value: 'bestmatch',
      defaultQuery: true
    },
    {
      label: _('Name'),
      value: 'fr_name',
      defaultNoQuery: true
    }
  ];

  /**
   * Get Configuration
   * @return Object
   */
  getConfiguration() {
    return {
      matcher: (url: any) => this.routeMatcher(url, this.name),
      children: [
        { path: '', component: RecordSearchPageComponent },
        { path: 'detail/:pid', component: DetailComponent }
      ],
      data: {
        adminMode: () => of({
          can: false,
          message: ''
        }),
        types: [
          {
            key: 'corporate-bodies',
            index: 'entities',
            label: _('Organisation'),
            component: ContributionBriefComponent,
            detailComponent: ContributionDetailViewComponent,
            searchFilters: [
              this.expertSearchFilter()
            ],
            aggregationsOrder: ['sources'],
            aggregationsExpand: ['sources'],
            preFilters: {
              type: 'bf:Organisation',
            },
            sortOptions: this._sortOptions(),
            showFacetsIfNoResults: true
          }
        ]
      }
    };
  }

  /**
   * Sort configuration
   *
   * @returns array with sort configuration
   */
   private _sortOptions() {
    const options = this._options;
    this._routeToolService.translateService.onLangChange.subscribe((translate: any) => {
      const key = options.findIndex((option: any) => option.label === 'Name');
      switch (translate.lang) {
        case 'de':
          options[key].value = 'de_name';
          break;
        default:
          options[key].value = 'fr_name';
      }
    });
    return options;
  }
}
