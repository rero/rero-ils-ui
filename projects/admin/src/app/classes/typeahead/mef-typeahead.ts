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
import { RecordService, SuggestionMetadata } from '@rero/ng-core';
import { AppSettingsService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITypeahead } from './ITypeahead-interface';
@Injectable({
  providedIn: 'root'
})
export class MefTypeahead implements ITypeahead {

  /** Name of typeahead */
  name = 'mef-persons';

  /** Type of contribution */
  type = 'Person';

  /** Entry point for MEF Api */
  apiMefEntryPoint = 'mef';

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _translateService - TranslateService
   * @param _appSettingsService - AppSettingsService
   */
  constructor(
    protected _recordService: RecordService,
    protected _translateService: TranslateService,
    protected _appSettingsService: AppSettingsService
  ) { }

  /** Get name of typeahead */
  getName() {
    return this.name;
  }

  /**
   * Convert the input value (i.e. $ref url) into a template html code.
   * @param options - remote typeahead options
   * @param value - formControl value i.e. $ref value
   * @returns Observable of string - html template representation of the value.
   */
  getValueAsHTML(options: any, value: string): Observable<string> {
    const url = value.split('/');
    const pid = url.pop();
    const source = url.pop();
    return this._recordService
      .getRecords(this.apiMefEntryPoint, `${source}.pid:${pid}`, 1, 1)
      .pipe(
        map((data: any) => {
          if (
            data.hits.hits.length > 0 &&
            data.hits.hits[0].metadata[source].authorized_access_point
          ) {
            return {
              source: source.toUpperCase(),
              name: data.hits.hits[0].metadata[source].authorized_access_point,
              url: data.hits.hits[0].metadata[source].identifier
            };
          }
        }),
        map((v: { name: string, source: string, url: string }) => `
          <a href="${v.url}" target="_blank">${v.name} <i class="fa fa-external-link"></i></a>
          <small class="badge badge-secondary ml-1">${v.source}</small>
        `)
      );
  }

  /**
   * Get the suggestions list given a search query.
   * @param options - remote typeahead options
   * @param query - search query to retrieve the suggestions list
   * @param numberOfSuggestions - the max number of suggestion to return
   * @returns - an observable of the list of suggestions.
   */
  getSuggestions(options: any, query: string, numberOfSuggestions: number): Observable<Array<SuggestionMetadata>> {
    if (!query) {
      return of([]);
    }

    const sources = this._appSettingsService.contributionSources
      .filter((source: string) => source !== 'rero');

    const contributionQuery = [
      `((autocomplete_name:${query})^2 OR ${query})`,
      `AND sources:(${sources.join(' OR ')})`,
      `AND type:bf\\:${this.type}`
    ].join(' ');

    return this._recordService
      .getRecords(
        this.apiMefEntryPoint,
        contributionQuery,
        1,
        numberOfSuggestions
      ).pipe(
        map((results: any) => {
          const names = [];
          if (!results) {
            return [];
          }
          results.hits.hits.map((hit: any) => {
            for (const source of this._sources()) {
              if (hit.metadata[source]) {
                names.push(this._getNameRef(hit.metadata, source));
              }
            }
          });
          return names;
        }),
        catchError(e => {
          switch (e.status) {
            case 400:
              return of([]);
            default:
              throw e;
          }
        })
      );
  }

  /**
   * Returns label, $ref and group.
   *
   * @param metadata the meta data.
   * @param sourceName The name of the source.
   * @return Metadata the label, $ref and group.
   */
  private _getNameRef(metadata: any, sourceName: string): SuggestionMetadata {
    const label = metadata[sourceName].authorized_access_point;
    const url = metadata[sourceName].identifier;
    return {
      label: `${label}`,
      externalLink: url,
      value: `https://mef.rero.ch/api/${sourceName}/${metadata[sourceName].pid}`,
      group: this._translateService.instant(
        'link to authority {{ sourceName }}',
        { sourceName }
      )
    };
  }

  /**
   * Get sources
   * @return array of sources
   */
  private _sources(): string[] {
    const language = this._translateService.currentLang;
    const order: any = this._appSettingsService.contributionsLabelOrder;
    const key = language in order ? language : 'fallback';
    const contributionSources = (key === 'fallback')
      ? order[order[key]]
      : order[key];
    const sources = contributionSources.filter((source: string) => source !== 'rero');
    return sources;
  }
}
