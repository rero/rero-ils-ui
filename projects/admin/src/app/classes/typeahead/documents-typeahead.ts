/*
 * RERO ILS UI
 * Copyright (C) 2020 RERO
 * Copyright (C) 2020 UCLouvain
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
import { ApiService, RecordService, SuggestionMetadata } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ITypeahead } from './ITypeahead-interface';

/**
 * Escape string using regular expression.
 */
function escapeRegExp(data) {
  return data.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

@Injectable({
  providedIn: 'root'
})
export class DocumentsTypeahead implements ITypeahead {

  /** Maximum length of the suggestion */
  maxLengthSuggestion = 100;

  /**
   * Constructor
   * @param _apiService - ApiService
   * @param _recordService - RecordService
   * @param _mainTitlePipe - MainTitlePipe
   */
  constructor(
    private _apiService: ApiService,
    private _recordService: RecordService,
    private _mainTitlePipe: MainTitlePipe
  ) { }

  /** Get name of typeahead */
  getName() {
    return 'documents';
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

    return this._recordService
      .getRecord(options.type, pid, 1)
      .pipe(
        map((data: any) =>
          `<span class="bg-light p-2"><strong>${this._mainTitlePipe.transform(data.metadata.title)}</strong></span>`
        )
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
    return this._recordService
      .getRecords(
        'documents',
        `(autocomplete_title:${query})^2 OR ${query}`,
        1,
        numberOfSuggestions
      ).pipe(
        map((results: any) => {
          const documents = [];
          if (!results) {
            return [];
          }
          results.hits.hits.map((hit: any) => {
            documents.push(this._getDocumentRef(hit.metadata, query));
          });
          return documents;
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
   * Returns label and $ref.
   *
   * @param metadata - the meta data.
   * @param query - search query term.
   * @return Metadata - the label, $ref.
   */
  private _getDocumentRef(metadata: any, query: string): SuggestionMetadata {
    let text = this._mainTitlePipe.transform(metadata.title);
    let truncate = false;
    if (text.length > this.maxLengthSuggestion) {
      truncate = true;
      text = this._mainTitlePipe.transform(metadata.title).substr(0, this.maxLengthSuggestion);
    }
    if (truncate) {
      text = text + '…';
    }
    return {
      label: text,
      value: this._apiService.getRefEndpoint('documents', metadata.pid)
    };
  }
}
