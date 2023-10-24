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

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService, RecordService, SuggestionMetadata } from '@rero/ng-core';
import { AppSettingsService, Entity } from '@rero/shared';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITypeahead } from './ITypeahead-interface';

@Injectable({
  providedIn: 'root'
})
export class MefTypeahead implements ITypeahead {

  /** Entry point API to get remote entity suggestions. */
  private _remoteSearchEntrypoint = 'api/remote_entities/search';
  /** Proxy API to use to get content of remote entity metadata (to avoid CORS javascript errors). */
  private _apiProxyEntryPoint = 'api/proxy';
  /** Entry point API to get locale entity suggestions. */
  private _localSearchEntrypoint = 'api/local_entities/search';

  /**
   * Constructor
   * @param http - HttpClient
   * @param translateService - TranslateService
   * @param appSettingsService - AppSettingsService
   * @param recordService - RecordService
   * @param apiService - ApiService
   */
  constructor(
    protected http: HttpClient,
    protected translateService: TranslateService,
    protected appSettingsService: AppSettingsService,
    private recordService: RecordService,
    private apiService: ApiService
  ) { }

  /** Get name of typeahead */
  getName() {
    return 'mef';
  }

  // GET HTML REPRESENTATION ==================================================
  /**
   * Convert the input value (i.e. $ref url) into a template html code.
   *
   * The value could represent either a remote entity, either a local entity.
   * A remote entity is an entity where metadata are stored outside the RERO
   * application system. A local entity is store as a Invenio resource into the
   * RERO application system.
   *
   * @param options: typeahead options
   * @param value: formControl value i.e. $ref value
   * @returns Observable on HTML template representation of the value.
   */
  getValueAsHTML(options: any, value: string): Observable<string> {
    // Determine if value is a local or remote entity ; depending on the
    // entity type the metadata retrieve method isn't the same
    return (value.match(/local_entities\/.*$/))
       ? this._getLocalValueAsHTML(options, value)
       : this._getRemoteValueAsHTML(options, value);
  }

  /**
   * Get HTML representation for a remote entity value.
   *
   * @param options: typeahead options
   * @param value: formControl value i.e. $ref value
   * @returns Observable on HTML template representation of the value.
   */
  private _getRemoteValueAsHTML(options: any, value: string): Observable<string> {
    // We need to call the url to get remote metadata. But we can't do that directly because this url could be external. So we need to call
    // a proxy passing the URL as query string argument.
    const source = value.split('/').slice(-2)[0];
    const params = new HttpParams().set('url', value);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http
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
          const entity = {
            label: data?.metadata?.authorized_access_point,
            type: data?.metadata?.type,
            uri: this._get_source_uri(data?.metadata?.identifiedBy, source) || value,
          };
          const badges = [{label: source.toUpperCase()}];
          return this._buildEntityResolutionResponse(entity, badges);
        }),
        catchError(e => this._handleEntityResolutionError(e, value))
    );
  }

  /**
   * Get HTML representation for a local entity value.
   *
   * @param options: typeahead options
   * @param value: formControl value i.e. $ref value
   * @returns Observable on HTML template representation of the value.
   */
  private _getLocalValueAsHTML(options: any, value: string): Observable<string> {
    const pid = value.split('/').slice(-1)[0];
    return this.recordService
      .getRecord('local_entities', pid)
      .pipe(
         map((data: any) => {
           const entity = {
             label: data.metadata.authorized_access_point,
             type: data.metadata.type,
             uri: this._buildLocalEntityDetailViewURI(data.metadata.pid)
           };
           const badges = [];
           if (data.metadata?.source_catalog) {
             badges.push({label: data.metadata.source_catalog});
           }
           return this._buildEntityResolutionResponse(entity, badges);
         }),
         catchError(e => this._handleEntityResolutionError(e, value))
      );
  }

  /**
   * Build the HTML representation for an entity.
   * @param entity: the entity to represent.
   * @param badges: badges list to append to the entity.
   * @returns the HTML representation for the entity.
   */
  private _buildEntityResolutionResponse(entity: {label:string, type: string, uri?: string}, badges: Array<{label: string, type?: string}>): string {
    // Type of entity
    const icon = Entity.getIcon(entity.type);
    const title = this.translateService.instant(entity.type);
    let output = `<i class="fa ${icon} mr-1" title="${title}"></i>`;
    output += (entity?.uri)
      ? `<a href="${entity.uri}" target="_blank">${entity.label} <i class="fa fa-external-link"></i></a>`
      : `<span>${entity.label}</span>`;
    badges.forEach(badge => {
      const className = (badge?.type)
        ? `badge-${badge.type}`
        : 'badge-secondary';
      output += `<small class="badge ${className} ml-1">${badge.label}</small>`;
    });
    return output;
  }

  /**
   * Manage entity resolution error.
   * @param error: the triggered error
   * @param value: the entity value causing the resolution error.
   */
  private _handleEntityResolutionError(error: Error, value: string): Observable<string> {
    console.error(`getValueAsHTML :: Unable to resolve entity :: ${value}`, error);
    return of(`<span class="text-warning"><i class="fa fa-exclamation-triangle mr-1"></i>${value}</span>`);
  }


  // GET ENTITY SUGGESTIONS ===================================================
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

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const params = new HttpParams().set('size', numberOfSuggestions);
    // Build API call to get remote suggestions.
    const remoteUrl = `${this._remoteSearchEntrypoint}/${searchCategory}/${searchTerm}/`;
    const remoteSuggestions$ = this.http.get(remoteUrl, {headers, params}).pipe(
      map((results: any) => results?.hits?.total >= 0 ? results.hits.hits : []),
      map((hits: Array<any>) => this._buildRemoteSuggestions(hits)),
      catchError(e => {
        switch (e.status) {
          case 400: return of([]);
          default: throw e;
        }
      })
    );
    // Build API call to get local entity suggestions.
    const localUrl = `${this._localSearchEntrypoint}/${searchCategory}/${searchTerm}/`;
    const localSuggestions$ = this.http.get(localUrl, {headers, params}).pipe(
      map((hits: Array<any>) => this._buildLocalSuggestions(hits)),
      catchError(e => {
        switch (e.status) {
          case 400: return of([]);
          default: throw e;
        }
      })
    );
    // Return the concatenation of both API request.
    return forkJoin([remoteSuggestions$, localSuggestions$]).pipe(
      map(([remoteHits, localHits]) => [...remoteHits, ...localHits])
    );
  }

  /**
   * Build suggestions for remote entities proxy response.
   * @param hits: the hits returned by the API call.
   * @returns Suggestions corresponding to hits.
   */
  private _buildRemoteSuggestions(hits: any): SuggestionMetadata[] {
    const suggestions = [];
    hits.map((hit: any) => {
      for (const source of this.sources()) {
        if (hit.metadata[source]) {
          suggestions.push(this._getNameRef(hit.metadata, source));
        }
      }
    });
    return suggestions;
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
      group: sourceName,
      column: 0
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
  public sources(): string[] {
    const language = this.translateService.currentLang;
    const order: any = this.appSettingsService.agentLabelOrder;
    const key = language in order ? language : 'fallback';
    const agentSources = (key === 'fallback')
      ? order[order[key]]
      : order[key];
    return agentSources.filter((source: string) => source !== 'rero');
  }

  /**
   * Build suggestions for local entities API call.
   * @param hits: the hits returned by the API call.
   * @returns Suggestions corresponding to hits.
   */
  private _buildLocalSuggestions(hits: any): SuggestionMetadata[] {
    return hits.map(hit => {
      return {
        label: hit.authorized_access_point,
        description: hit?.source_catalog,
        value: this.apiService.getRefEndpoint('local_entities', hit.pid),
        externalLink: this._buildLocalEntityDetailViewURI(hit.pid),
        group: 'local',
        column: 1,
      };
    });
  }

  /**
   * Creates a local entity detail view URI
   * TODO :: find a better/smarter way to build this URI than current static string construction..
   * @param pid - the entity pid
   * @returns the entity detail view URI
   */
  private _buildLocalEntityDetailViewURI(pid: string): string {
    let url = `/records/local_entities/detail/${pid}`;
    // TODO :: Very ugly hack.... I'm dying... but not found better alternative :(
    //   The problem is that professional interface is included as a webComponent into the public RERO-ILS app.
    //   So nor `router.snapshot`, nor `Location` haven't the context that "/professional" prefix url exists,
    //   The only way I found to deal with this problem is to check the complete "window.location"
    if (window.location.pathname.startsWith('/professional/')) {
      url = `/professional${url}`;
    }
    return url;
  }
}
