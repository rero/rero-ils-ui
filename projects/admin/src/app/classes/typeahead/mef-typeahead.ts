/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
 * Copyright (C) 2020-2023 UCLouvain
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

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SuggestionMetadata } from '@rero/ng-core';
import { AppSettingsService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITypeahead } from './ITypeahead-interface';
@Injectable({
  providedIn: 'root'
})
export class MefTypeahead implements ITypeahead {

  /** Entry point for MEF Api */
  private _apiSearchEntryPoint = 'api/remote_entities/search';
  private _apiProxyEntryPoint = 'api/proxy';

  /**
   * Constructor
   * @param _http - HttpClient
   * @param _translateService - TranslateService
   * @param _appSettingsService - AppSettingsService
   */
  constructor(
    protected _http: HttpClient,
    protected _translateService: TranslateService,
    protected _appSettingsService: AppSettingsService
  ) { }

  /** Get name of typeahead */
  getName() {
    return 'mef';
  }

  /**
   * Convert the input value (i.e. $ref url) into a template html code.
   * @param options - remote typeahead options
   * @param value - formControl value i.e. $ref value
   * @returns Observable of string - html template representation of the value.
   */
  getValueAsHTML(options: any, value: string): Observable<string> {
    // We need to call the url to get remote metadata. But we can't do that directly because this url could be external.
    // So we need to call a proxy passing the URL as query string argument.
    const source = value.split('/').slice(-2)[0];
    const params = new HttpParams().set('url', value);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http
      .get(this._apiProxyEntryPoint, {params, headers})
      .pipe(
        // TODO :: remove this `map` pipe when MEF api return correct properties
        //   For MEF agents, the source URL is serialized into `identifier` properties ; for MEF concepts, this URL is found into an array
        //   of identifiers. This `map` pipe harmonize MEF server response to allow a single (and simpler) URL extraction in next `map` pipe
        //   Additionally, all identifier sources are transform to lowercase (MEF concepts response return "IdRef" instead of "idref")
        map((data: any) => {
          if (data?.metadata && data.metadata?.identifier) {
            data.metadata['identifiedBy'] = [{source, 'type': 'uri', 'value': data.metadata.identifier}];
            delete data.metadata.identifier;
          }
          if (data?.metadata && data?.metadata.identifiedBy) {
            data.metadata.identifiedBy.map(identifier => identifier.source = identifier.source.toLowerCase());
          }
          return data;
        }),
        map((data: any) => {
          const link = this._get_source_uri(data?.metadata?.identifiedBy, source) || value;
          const label = data?.metadata?.authorized_access_point;
          return `
            <a href="${link}" target="_blank">${label} <i class="fa fa-external-link"></i></a>
            <small class="badge badge-secondary ml-1">${source.toUpperCase()}</small>
          `
        }),
        catchError(e => {
          console.error(`getValueAsHTML :: Unable to resolve ${value}`, e);
          return of(`<span class="text-warning"><i class="fa fa-exclamation-triangle mr-1"></i>${value}</span>`);
        })
    );
  }

  /**
   * Get the suggestions list given a search query.
   * @param options - remote typeahead options
   * @param searchTerm - search query to retrieve the suggestions list
   * @param numberOfSuggestions - the max number of suggestion to return
   * @returns - an observable of the list of suggestions.
   */
  getSuggestions(options: any, searchTerm: string, numberOfSuggestions: number): Observable<Array<SuggestionMetadata | string>> {
    // If no search term is specified, no need to do a search, just return an empty suggestion array
    if (!searchTerm) {
      return of([]);
    }
    // If no search category is selected [bf:Person, bf:Organisation, bf:Topic, ...] (from option list), then throw an error
    if (null == options?.filters?.selected) {
      throw Error('Missing filters definition');
    }

    const searchCategory = options.filters.selected;
    // TODO :: Why do I need to add an ending slash to use proxy-config and don't be redirected (308) receiving a CORS errors
    const url = `${this._apiSearchEntryPoint}/${searchCategory}/${searchTerm}/`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.get(url, {headers}).pipe(
      map((results: any) => results?.hits?.total >= 0 ? results.hits.hits : []),
      map((hits: Array<any>) => {
        const suggestions = [];
        hits.map((hit: any) => {
          for (const source of this._sources()) {
            if (hit.metadata[source]) {
              suggestions.push(this._getNameRef(hit.metadata, source));
            }
          }
        });
        return suggestions;
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
   * Returns a suggestion to display for the user.
   *
   * @param metadata the metadata.
   * @param sourceName The name of the source (idref, gnd, ...)
   * @return The suggestion to display.
   */
  private _getNameRef(metadata: any, sourceName: string): SuggestionMetadata {
    metadata = metadata[sourceName];
    return {
      label: metadata.authorized_access_point,
      externalLink: this._get_source_uri(metadata?.identifiedBy, sourceName),
      value: this._get_source_uri(metadata?.identifiedBy, 'mef'),
      group: this._translateService.instant('link to authority {{ sourceName }}', { sourceName })
    };
  }

  /** Get the URI corresponding to a source into an identifiedBy array
   *
   * @param identifiers: the `identifiedBy` array field.
   * @param sourceName: the name of the source (idref, gnd, ...)
   * @return the corresponding URI or null if not found
   */
  private _get_source_uri(identifiers: Array<{source:string, type:string, value:string}>, sourceName: string): string|undefined {
    const identifier = identifiers.find(id => id.source.toLowerCase() == sourceName.toLowerCase() && id.type == 'uri');
    return (identifier != undefined)
      ? identifier.value
      : undefined;
  }

  /**
   * Get sources
   * @return array of sources
   */
  private _sources(): string[] {
    const language = this._translateService.currentLang;
    const order: any = this._appSettingsService.agentLabelOrder;
    const key = language in order ? language : 'fallback';
    const agentSources = (key === 'fallback')
      ? order[order[key]]
      : order[key];
    const sources = agentSources.filter((source: string) => source !== 'rero');
    return sources;
  }
}
