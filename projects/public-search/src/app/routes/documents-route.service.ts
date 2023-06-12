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
import { ActivatedRoute } from '@angular/router';
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
   * Constructor
   * @param translateService - TranslateService
   * @param appConfigService - AppConfigService
   * @param _route - ActivatedRoute
   */
  constructor(
    translateService: TranslateService,
    private appConfigService: AppConfigService,
    private _route: ActivatedRoute
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
              aggregationsName: {
                online: _('Online resources'),
                not_online: _('Physical resources'),
                organisation: _('Library'),
                genreForm: _('Genre, form'),
                intendedAudience: _('Intended audience'),
                year: _('Publication year'),
                subject_fiction: _('Subject (fiction)'),
                subject_no_fiction: _('Subject (non-fiction)'),
              },
              showFacetsIfNoResults: true,
              aggregationsOrder: this.aggregations(viewcode),
              aggregationsExpand: () => {
                const expand = ['document_type'];
                const queryParams = this._route.snapshot.queryParams;
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
                  label: _('Online resources'),
                  filter: 'online',
                  value: 'true'
                },
                {
                  label: _('Physical resources'),
                  filter: 'not_online',
                  value: 'true'
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
              key: 'persons',
              index: 'remote_entities',
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
              },
              sortOptions: this._sortOptions()
            },
            {
              key: 'corporate-bodies',
              index: 'remote_entities',
              component: ContributionBriefComponent,
              label: _('Corporate bodies'),
              aggregationsOrder: ['sources'],
              aggregationsExpand: ['sources'],
              listHeaders: {
                Accept: 'application/rero+json, application/json'
              },
              preFilters: {
                view: `${viewcode}`,
                type: 'bf:Organisation',
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
        _('organisation'),
        _('language'),
        _('year'),
        _('author'),
        _('subject_no_fiction'),
        _('subject_fiction'),
        _('genreForm'),
        _('intendedAudience'),
        _('status')
      ];
    } else {
      return [
        _('document_type'),
        _('library'),
        _('language'),
        _('year'),
        _('author'),
        _('subject_no_fiction'),
        _('subject_fiction'),
        _('genreForm'),
        _('intendedAudience'),
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
    this._translateService.onLangChange.subscribe((translate: any) => {
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
