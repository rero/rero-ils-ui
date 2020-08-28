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
import { Injectable, Injector } from '@angular/core';
import { RemoteTypeaheadService, RecordService, ApiService, SuggestionMetadata } from '@rero/ng-core';
import { Observable } from 'rxjs';
import { MefTypeahead } from '../class/mef-typeahead';
import { DocumentsTypeahead } from '../class/documents-typeahead';

@Injectable({
  providedIn: 'root'
})
export class UiRemoteTypeaheadService extends RemoteTypeaheadService {

  /** Custom typeahead Type */
  private _typeaheadTypes = {
    mef: this._injector.get(MefTypeahead),
    documents: this._injector.get(DocumentsTypeahead)
  };

  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _apiService - APIService
   * @param _injector - Injector, use of the injector to enable retrieval
   *                    of class by name in Dependency injection
   */
  constructor(
    protected _recordService: RecordService,
    protected _apiService: ApiService,
    private _injector: Injector
  ) {
    super(_recordService, _apiService);
  }

  /**
   * Convert the input value (i.e. $ref url) into a template html code
   * @param options - remote typeahead options
   * @param value - formControl value i.e. $ref value
   * @returns Observable of string - html template representation of the value.
   */
  getValueAsHTML(options: any, value: string): Observable<string> {
    return (options.hasOwnProperty('type') && options.type in this._typeaheadTypes)
    ? this._typeaheadTypes[options.type].getValueAsHTML(options, value)
    : super.getValueAsHTML(options, value);
  }

  /**
   * Get the suggestions list given a search query
   * @param options - remote typeahead options
   * @param query - search query to retrieve the suggestions list
   * @param numberOfSuggestions - the max number of suggestion to return
   * @returns - an observable of the list of suggestions.
   */
  getSuggestions(options: any, query: string, numberOfSuggestions: number): Observable<Array<SuggestionMetadata>> {
    return (options.hasOwnProperty('type') && options.type in this._typeaheadTypes)
    ? this._typeaheadTypes[options.type].getSuggestions(options, query, numberOfSuggestions)
    : super.getSuggestions(options, query, numberOfSuggestions);
  }
}
