/*
 * RERO ILS UI
 * Copyright (C) 2019-2023 RERO
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

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe } from '../pipe/main-title.pipe';
import { AppSettingsService } from './app-settings.service';
import { EntityType, EntityTypeIcon } from '../class/entities';

@Injectable({
  providedIn: 'root'
})
export class SearchBarConfigService {

  /** View code */
  private _viewcode: string = undefined;

  /** Typeahead options limit */
  private _typeaheadOptionsLimit: number = 15;

  /** Max Length Suggestion */
  private _maxLengthSuggestion: number = 100;

  /** Is admin */
  private _isAdmin: boolean = false;

  /** Set typeahead options limit */
  set typeaheadOptionsLimit(limit: number) {
    this._typeaheadOptionsLimit = limit;
  }

  /** Get typeahead options limit */
  get typeaheadOptionsLimit(): number {
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
   * @param isAdmin - boolean, are we on the admin interface
   * @param component - any
   * @param viewcode - string or undefined, view code for the public interface
   * @param maxLengthSuggestion - number of max suggestion
   * @return array of contribution types configuration
   */
  getConfig(isAdmin: boolean, component: any, viewcode?: string | undefined, maxLengthSuggestion: number = 100): any[] {
    this._isAdmin = isAdmin;
    this._viewcode = viewcode;
    this._maxLengthSuggestion = maxLengthSuggestion;

    return [
      {
        type: 'documents',
        field: 'autocomplete_title',
        maxNumberOfSuggestions: 10,
        getSuggestions: (query: any, documents: any) => this.getDocumentsSuggestions(query, documents),
        preFilters: viewcode !== undefined ? { view: viewcode } : {}
      },
      {
        type: 'entities',
        field: 'autocomplete_name',
        maxNumberOfSuggestions: 5,
        getSuggestions: (query: any, entities: any) => this.getEntitiesSuggestions(query, entities),
        preFilters: viewcode !== undefined ? { view: viewcode } : {}
      }
    ];
  }

  /**
   * Get documents suggestions
   * @param query - string, string searched
   * @param documents - documents hits
   * @return array - array of records formatted
   */
  private getDocumentsSuggestions(query: string, documents: any): any[] {
    const values = [];
    documents.hits.hits.map((hit: any) => {
      const title = this._mainTitlePipe.transform(hit.metadata.title);
      let text = title;
      if (title.length > this._maxLengthSuggestion) {
        text = this._truncatePipe.transform(title, this._maxLengthSuggestion);
      }

      values.push({
        text: this.highlightSearch(text, query),
        query: title.replace(/[:\-\[\]()/"]/g, ' ').replace(/\s\s+/g, ' '),
        index: 'documents',
        category: this._translateService.instant('documents')
      });
    });
    return values;
  }

  /**
   * Get entities suggestion
   * @param query - string, string searched
   * @param entities - entities hits
   * @returns array - array of records formatted
   */
  private getEntitiesSuggestions(query: string, entities: any): any[] {
    const values = [];
    entities.hits.hits.map((hit: any) => {
      const text = this._getContributionName(hit.metadata);
      values.push({
        text: this.highlightSearch(text, query),
        index: 'entities',
        query: '',
        category: this._translateService.instant('authors/subjects'),
        href: this.generateEntityLink(hit.metadata),
        iconCssClass: `fa ${this.findIconByType(hit.metadata.type)}`
      });
    });
    return values;
  }

  /**
   * Highlight search term
   * @param text - text of result
   * @param query - query
   * @return string - highlight text
   */
  private highlightSearch(text: string, query: string): string {
    return text.replace(new RegExp(
      this.escapeRegExp(query), 'gi'),
      `<b>${query}</b>`
      );
  }

  /**
   * Generate Entity Link
   * @param type - string, type of contribution
   * @param pid - string, pid of record
   * @return the url path
   */
  private generateEntityLink(metadata: any): string {
    const { pid, resource_type } = metadata;
    if (this._isAdmin) {
      return `/records/${resource_type}_entities/detail/${pid}`;
    } else {
      return `/${this._viewcode}/entities/${resource_type}/${pid}`;
    }
  }

  /**
   * Find icon by type
   * @param type - entity type (Ex: bf:Organisation)
   * @returns The class icon
   */
  private findIconByType(type: string): string {
    switch(type) {
      case EntityType.ORGANISATION : return EntityTypeIcon.ORGANISATION;
      case EntityType.PERSON : return EntityTypeIcon.PERSON;
      case EntityType.PLACE : return EntityTypeIcon.PLACE;
      case EntityType.TEMPORAL : return EntityTypeIcon.TEMPORAL;
      case EntityType.TOPIC : return EntityTypeIcon.TOPIC;
      case EntityType.WORK : return EntityTypeIcon.WORK;
      default: return 'fa-question-circle';
    }
  }

  /**
   * Escape RegExp
   * @param data - string
   * @return string
   */
  private escapeRegExp(data: string): string {
    // $& means the whole matched string
    return data.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Get contribution name
   * @param metadata - metadata of record
   * @return string
   */
  private _getContributionName(metadata: any): string {
    if (metadata.resource_type === 'remote') {
      const language = this._translateService.currentLang;
      const order: any = this._appSettingsService.agentLabelOrder;
      const key = (language in order) ? language : 'fallback';
      const agentSources = (key === 'fallback')
        ? order[order[key]]
        : order[key];

      for (const source of agentSources) {
        if (metadata[source] && metadata[source].authorized_access_point) {
          return metadata[source].authorized_access_point;
        }
      }
    } else {
      const key = `authorized_access_point_${this._translateService.currentLang}`;
      const accessPointKey = Object.keys(metadata).includes(key) ? key : 'authorized_access_point';
      return metadata[accessPointKey];
    }
  }
}
