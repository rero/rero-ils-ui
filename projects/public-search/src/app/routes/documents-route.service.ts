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

import { inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { EntityBriefViewComponent } from '@rero/shared';
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

  private appConfigService: AppConfigService = inject(AppConfigService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  /** loaded configuration (viewcode) */
  private availableConfig = [];

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
   * Resource name of routes
   */
  getResources(): string[] {
    return ['documents', 'entities'];
  }

  /**
   * Create route
   * @param viewcode - string
   * @return dictionary route configuration or null if loaded
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
              aggregationsName: {
                online: _('Online resources'),
                not_online: _('Physical resources'),
                organisation: _('Library'),
                genreForm: _('Genre, form'),
                intendedAudience: _('Intended audience'),
                acquisition: _('Acquisition date'),
                year: _('Publication year'),
                subject: _('Subject'),
                fiction_statement: _('Fiction statement'),
              },
              showFacetsIfNoResults: true,
              aggregationsOrder: this.aggregations(viewcode),
              aggregationsExpand: () => {
                const expand = ['document_type', 'fiction_statement'];
                const queryParams = this.route.snapshot.queryParams;
                if (this.appConfigService.globalViewName === viewcode) {
                  if (queryParams.location || queryParams.library) {
                    expand.push('organisation');
                  }
                } else {
                  if (queryParams.location) {
                    expand.push('library');
                  }
                }
                return expand;
              },
              aggregationsBucketSize: 10,
              searchFilters: [
                {
                  filters: [
                    {
                      label: _('Search in full text'),
                      filter: 'fulltext',
                      value: 'true'
                    }
                  ]
                },
                {
                  label: _('Show only:'),
                  filters: [
                    {
                      label: _('Online resources'),
                      filter: 'online',
                      value: 'true'
                    },
                    {
                      label: _('Physical resources'),
                      filter: 'not_online',
                      value: 'true'
                    }
                  ]
                }
              ],
              preFilters: {
                view: `${viewcode}`,
                simple: 1
              },
              listHeaders: {
                Accept: 'application/rero+json, application/json'
              },
              exportFormats: [
                {
                  label: 'JSON',
                  format: 'raw',
                },
                {
                  label: 'RIS (Endnote, Zotero, ...)',
                  format: 'ris',
                },
              ],
              sortOptions: [
                {
                  label: _('Relevance'),
                  value: 'bestmatch',
                  defaultQuery: true
                },
                {
                  label: _('Date (newest)'),
                  value: 'pub_date_new'
                },
                {
                  label: _('Date (oldest)'),
                  value: 'pub_date_old',
                },
                {
                  label: _('Title'),
                  value: 'title',
                  defaultNoQuery: true
                }
              ]
            },
            {
              key: 'entities',
              index: 'entities',
              component: EntityBriefViewComponent,
              label: _('Authors/Subjects'),
              aggregationsOrder: ['type'],
              aggregationsExpand: ['type'],
              listHeaders: {
                Accept: 'application/rero+json, application/json'
              },
              preFilters: {
                view: `${viewcode}`,
                simple: 1
              },
              sortOptions: this._sortOptions()
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
        _('fiction_statement'),
        _('organisation'),
        _('language'),
        _('year'),
        _('author'),
        _('subject'),
        _('genreForm'),
        _('intendedAudience'),
        _('acquisition'),
        _('status')
      ];
    } else {
      return [
        _('document_type'),
        _('fiction_statement'),
        _('library'),
        _('language'),
        _('year'),
        _('author'),
        _('subject'),
        _('genreForm'),
        _('intendedAudience'),
        _('acquisition'),
        _('status')
      ];
    }
  }

  /**
   * Sort configuration
   *
   * @returns array with sort configuration
   */
  private _sortOptions() {
    const options = this._options;
    this.translateService.onLangChange.subscribe((translate: any) => {
      const key = options.findIndex((option: any) => option.label === 'Name');
      switch (translate.lang) {
        case 'de':
          options[key].value = 'de_name';
          break;
        case 'en':
          options[key].value = 'en_name';
          break;
        case 'it':
          options[key].value = 'it_name';
          break;
        default:
          options[key].value = 'fr_name';
      }
    });
    return options;
  }
}
