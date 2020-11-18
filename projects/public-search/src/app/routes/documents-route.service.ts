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
import { ContributionBriefComponent } from '@rero/shared';
import { of } from 'rxjs';
import { AppConfigService } from '../app-config.service';
import { DocumentBriefComponent } from '../document-brief/document-brief.component';
import { DocumentRecordSearchComponent } from '../document-record-search/document-record-search.component';
import { BaseRoute } from './base-route';
import { ResourceRouteInterface } from './resource-route-interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentsRouteService extends BaseRoute implements ResourceRouteInterface {

  /** loaded configuration (viewcode) */
  private availableConfig = [];

  /**
   * Constructor
   * @param translateService - TranslateService
   * @param appConfigService - AppConfigService
   */
  constructor(
    translateService: TranslateService,
    private appConfigService: AppConfigService
  ) {
    super(translateService);
  }

  /**
   * Resource name of routes
   */
  getResources(): string[] {
    return ['documents', 'persons', 'corporate-bodies'];
  }

  /**
   * Create route
   * @param viewcode - string
   * @return dictionnary route configuration or null if loaded
   */
  create(viewcode: string): null | {} {
    if (!(this.availableConfig.some(v => v === viewcode))) {
      this.availableConfig.push(viewcode);

      return {
        path: `${viewcode}/search/:type`,
        children: [
          { path: '', component: DocumentRecordSearchComponent },
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
              key: 'documents',
              component: DocumentBriefComponent,
              label: _('Documents'),
              aggregations: (aggregations: any) => this.aggFilter(aggregations),
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
              key: 'persons',
              index: 'contributions',
              component: ContributionBriefComponent,
              label: _('Persons'),
              aggregationsOrder: ['sources'],
              aggregationsExpand: ['sources'],
              listHeaders: {
                Accept: 'application/rero+json, application/json'
              },
              preFilters: {
                view: `${viewcode}`,
                type: 'bf:Person',
                simple: 1
              }
            },
            {
              key: 'corporate-bodies',
              index: 'contributions',
              component: ContributionBriefComponent,
              label: _('Organisations'),
              aggregationsOrder: ['sources'],
              aggregationsExpand: ['sources'],
              listHeaders: {
                Accept: 'application/rero+json, application/json'
              },
              preFilters: {
                view: `${viewcode}`,
                type: 'bf:Organisation',
                simple: 1
              }
            }
          ]
        }
      };
    }
  }

  /**
   * List of aggregations
   *
   * @param viewcode - viewcode
   */
  private aggregations(viewcode: string) {
    if (this.appConfigService.globalViewName === viewcode) {
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
}
