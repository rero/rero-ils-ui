/*
 * RERO ILS UI
 * Copyright (C) 2020-2023 RERO
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
import { ApiService, RecordService, SuggestionMetadata, TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { ITypeahead } from './ITypeahead-interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsTypeahead implements ITypeahead {

  /** Maximum length of the suggestion */
  maxLengthSuggestion = 100;

  /**
   * Constructor
   * @param _apiService - ApiService
   * @param _recordService - RecordService
   * @param _mainTitlePipe - MainTitlePie
   * @param _truncateTextPipe - TruncateTextPipe
   * @param _translateService - TranslateService
   */
  constructor(
    private _apiService: ApiService,
    private _recordService: RecordService,
    private _mainTitlePipe: MainTitlePipe,
    private _truncateTextPipe: TruncateTextPipe,
    private _translateService: TranslateService
  ) { }

  /** Get name of typeahead */
  getName() {
    return 'items';
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

    return this._recordService.getRecord(options.type, pid, 1)
    .pipe(
      switchMap((record: any) => {
        return this._recordService.getRecord('documents', record.metadata.document. pid)
        .pipe(
          map((document: any | Error) =>
            `<span class="pt-0">
              <span class="font-weight-bold">${this._mainTitlePipe.transform(document.metadata.title)}</span><br>
              <strong>${this._translateService.instant('Barcode')}</strong>: ${record.metadata.barcode}
             </span>`
          )
        );
      })
    );
  }

  /**
   * Convert the input value (i.e. $ref url) into a template html code.
   * @param options - remote typeahead options
   * @param value - formControl value i.e. $ref value
   * @returns Observable of string - html template representation of the value.
   */
  getSuggestions(options: any, query: string, numberOfSuggestions: number): Observable<Array<SuggestionMetadata | string>> {
    if (!query) {
      return of([]);
    }

    const documentObs = (documentPid: string) => {
      return this._recordService.getRecord('documents', documentPid).pipe(
        map((doc: any) => doc.metadata)
      );
    };

    return this._recordService.getRecords(
      options.type,
      `autocomplete_barcode:${query}`,
      1,
      numberOfSuggestions
    ).pipe(
      mergeMap((result: any) => {
        return from(result.hits.hits).pipe(
          mergeMap((item: any) =>
            documentObs(item.metadata.document.pid).pipe(
              map(doc => {
                return {
                  label: [
                    this._truncateTextPipe.transform(
                      this._mainTitlePipe.transform(doc.title),
                      10,
                      '…'
                    ),
                    item.metadata.barcode
                  ].join('<br>'),
                  value: this._apiService.getRefEndpoint('items', item.metadata.pid)
                };
              }),
            )
          ),
          toArray()
        );
      })
    );
  }
}
