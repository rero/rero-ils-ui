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
import { TranslateService } from '@ngx-translate/core';
import { TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe } from '../pipe/main-title.pipe';
import { AppSettingsService } from './app-settings.service';

@Injectable({
  providedIn: 'root'
})
export class SearchBarConfigService {

  /** View code */
  private _viewcode: string = undefined;

  /** Typeahead options limit */
  private _typeaheadOptionsLimit = 15;

  /** Max Length Suggestion */
  private _maxLengthSuggestion = 100;

  /** Is admin */
  private _isAdmin = false;

  /** Set typeahead options limit */
  set typeaheadOptionsLimit(limit: number) {
    this._typeaheadOptionsLimit = limit;
  }

  /** Get typeahead options limit */
  get typeaheadOptionsLimit() {
    return this._typeaheadOptionsLimit;
  }

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _mainTitlePipe - MainTitlePipe
   * @param _appSettingsService - AppSettingsService
   * @param _truncatePipe - TruncateTextPipe
   */
  constructor(
    private _translateService: TranslateService,
    private _mainTitlePipe: MainTitlePipe,
    private _appSettingsService: AppSettingsService,
    private _truncatePipe: TruncateTextPipe
  ) {}

  /**
   * Get Config
   * @param isAdmin - boolean
   * @param component - any
   * @param viewcode - string
   * @param maxLengthSuggestion - number
   * @return array of contribution types configuration
   */
  getConfig(isAdmin: boolean, component: any, viewcode?: string | undefined, maxLengthSuggestion: number = 100) {
    this._isAdmin = isAdmin;
    this._viewcode = viewcode;
    this._maxLengthSuggestion = maxLengthSuggestion;

    // If you add a new type, please specify it in the "shared-config.service.ts"
    // file on contributionAgentTypes attribute
    return [
      {
        type: 'documents',
        field: 'autocomplete_title',
        maxNumberOfSuggestions: 5,
        getSuggestions: (query: any, documents: any) => this._getDocumentsSuggestions(query, documents),
        preFilters: viewcode !== undefined ? { view: viewcode } : {}
      },
      {
        type: 'persons',
        index: 'contributions',
        field: 'autocomplete_name',
        maxNumberOfSuggestions: 5,
        getSuggestions: (query: any, persons: any) => this._getPersonsSuggestions(query, persons),
        component,
        preFilters: viewcode !== undefined ? { view: viewcode, type: 'bf:Person' } : { type: 'bf:Person' }
      },
      {
        type: 'organisations',
        index: 'contributions',
        field: 'autocomplete_name',
        maxNumberOfSuggestions: 5,
        getSuggestions: (query: any, organisations: any) => this._getOrganisationsSuggestions(query, organisations),
        component,
        preFilters: viewcode !== undefined ? { view: viewcode, type: 'bf:Organisation' } : { type: 'bf:Organisation' }
      }
    ];
  }

  /**
   * Get documents suggestions
   * @param query - string, string searched
   * @param documents - search result records
   * @return array - array of records formatted
   */
  private _getDocumentsSuggestions(query: string, documents: any) {
    const values = [];
    documents.hits.hits.map((hit: any) => {
      const title = this._mainTitlePipe.transform(hit.metadata.title);
      let text = title;
      if (title.length > this._maxLengthSuggestion) {
        text = this._truncatePipe.transform(title, this._maxLengthSuggestion);
      }

      values.push({
        text: this._highlightSearch(text, query),
        query: title.replace(/[:\-\[\]()/"]/g, ' ').replace(/\s\s+/g, ' '),
        index: 'documents',
        category: this._translateService.instant('documents')
      });
    });
    return values;
  }

  /**
   * Get persons suggestions
   * @param query - string, string searched
   * @param persons - search result records
   * @return array - array of records formatted
   */
  private _getPersonsSuggestions(query: string, persons: any[]) {
    return this._getContributionsSuggestions(
      query,
      persons,
      'persons',
      this._translateService.instant('person direct links'),
      'user'
    );
  }

  /**
   * Get organisations suggestions
   * @param query - string, string searched
   * @param organisations - search result records
   * @return array - array of records formatted
   */
  private _getOrganisationsSuggestions(query: string, organisations: any[]) {
    return this._getContributionsSuggestions(
      query,
      organisations,
      'corporate-bodies',
      this._translateService.instant('corporate bodies direct links'),
      'building'
    );
  }


  /**
   * Get contributions suggestions
   * @param query - string, string searched
   * @param records - search result records
   * @param urlIndex - string, url link for current type
   * @param category - string, title for select group
   * @param icon - string, name of icon (without prefix fa-)
   * @param isAdmin - boolean
   * @return array - array of records formatted
   */
  private _getContributionsSuggestions(
    query: string,
    records: any,
    urlIndex: string,
    category: string,
    icon: string
  ) {
    const values = [];
    records.hits.hits.map((hit: any) => {
      const text = this._getContributionName(hit.metadata);
      values.push({
        text: this._highlightSearch(text, query),
        query: '',
        index: 'contributions',
        category,
        href: this._generateContributionLink(urlIndex, hit.metadata.pid),
        iconCssClass: `fa fa-${icon}`
      });
    });
    return values;
  }

  /**
   *
   * @param text - text of result
   * @param query - query
   * @return string - highlight text
   */
  private _highlightSearch(text: string, query: string) {
    return text.replace(new RegExp(
      this._escapeRegExp(query), 'gi'),
      `<b>${query}</b>`
      );
  }

  /**
   * Generate Contribution Link
   * @param type - string, type of contribution
   * @param pid - string, pid of record
   */
  private _generateContributionLink(type: string, pid: string) {
    if (this._isAdmin) {
      return `/records/${type}/detail/${pid}`;
    } else {
      return `/${this._viewcode}/${type}/${pid}`;
    }
  }

  /**
   * Escape RegExp
   * @param data - string
   * @return string
   */
  private _escapeRegExp(data: string) {
    // $& means the whole matched string
    return data.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get contribution name
   * @param metadata - metadata of record
   * @return string
   */
  private _getContributionName(metadata: any): string {
    const language = this._translateService.currentLang;
    const order: any = this._appSettingsService.contributionsLabelOrder;
    const key = (language in order) ? language : 'fallback';
    const contributionSources = (key === 'fallback')
      ? order[order[key]]
      : order[key];

    for (const source of contributionSources) {
      if (metadata[source] && metadata[source].authorized_access_point) {
        return metadata[source].authorized_access_point;
      }
    }
  }
}
