/*
 * RERO ILS UI
 * Copyright (C) 2024-2025 RERO
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
import { TranslateService } from '@ngx-translate/core';
import { ApiService, RecordService, TruncateTextPipe } from '@rero/ng-core';
import { IQueryOptions, ISuggestionItem } from '@rero/prime/remote-autocomplete/remote-autocomplete.interface';
import { MainTitlePipe } from '@rero/shared';
import { catchError, forkJoin, from, map, mergeMap, Observable, of, switchMap, toArray } from 'rxjs';
import { IRemoteAutocomplete } from './i-remote-autocomplete';

/* eslint-disable  @typescript-eslint/no-explicit-any */

@Injectable({
  providedIn: 'root'
})
export class ItemsRemoteService implements IRemoteAutocomplete {

  private recordService: RecordService = inject(RecordService);
  private truncateTextPipe: TruncateTextPipe = inject(TruncateTextPipe);
  private mainTitlePipe: MainTitlePipe = inject(MainTitlePipe);
  private apiService: ApiService = inject(ApiService);
  private translateService: TranslateService = inject(TranslateService);

  getName(): string {
    return 'items';
  }

  documentObs = (pid: string) => this.recordService.getRecord('documents', pid)
  .pipe(map(record => record.metadata));

  libraryObs = (pid: string) => this.recordService.getRecord('libraries', pid)
  .pipe(map(record => record.metadata));

  getSuggestions(query: string, queryOptions: IQueryOptions): Observable<ISuggestionItem[]> {
    if (!query) {
      return of([]);
    }

    let queryString = `autocomplete_barcode:${query}`;
    if(queryOptions.filter) {
      queryString += ` ${queryOptions.filter}`;
    }

    return this.recordService.getRecords(
      queryOptions.type,
      queryString,
      1,
      queryOptions.maxOfResult
    ).pipe(
      switchMap((result: any) => {
        return from(result.hits.hits).pipe(
          mergeMap((item: any) => forkJoin([
            this.documentObs(item.metadata.document.pid),
            this.libraryObs(item.metadata.library.pid)
          ])
          .pipe(
            map(([document, library]) => {
              const title = this.truncateTextPipe.transform(
                this.mainTitlePipe.transform(document.title),
                10,
                '…'
              );
              return {
                label: `${title}<br>${library.name}`,
                value: this.apiService.getRefEndpoint('items', item.metadata.pid),
                summary: item.metadata.barcode
              }
            })
            )
          ),
          toArray()
        );
      }),
      catchError(e => {
        switch (e.status) {
          case 400:
            return [];
          default:
            throw e;
        }
      })
    )
  }

  getValueAsHTML(queryOptions: IQueryOptions, item: ISuggestionItem): Observable<string> {
    const url = item.value.split('/');

    return this.recordService.getRecord(queryOptions.type, url.pop(), 1).pipe(
      switchMap(record => forkJoin({
        record: of(record),
        library: this.libraryObs(record.metadata.library.pid),
        document: this.documentObs(record.metadata.document.pid),
      })),
      map(({ record, library, document }) => `
        <div class="flex ui:pt-0">
          <div>
            ${this.mainTitlePipe.transform(document.title)}
          </div>
          <div>
            <span class="ui:font-bold">${this.translateService.instant('Library')}</span>: ${library.name}
          </div>
          <div>
            <span class="ui:font-bold">${this.translateService.instant('Barcode')}</span>: ${record.metadata.barcode}
          </div>
        </div>
      `)
    );
  }
}
