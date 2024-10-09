/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { catchError, from, map, mergeMap, Observable, of, switchMap, tap, toArray } from 'rxjs';
import { IRemoteAutocomplete } from './i-remote-autocomplete';

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

  getSuggestions(query: string, queryOptions: IQueryOptions, currentPid: string): Observable<ISuggestionItem[]> {
    if (!query) {
      return of([]);
    }

    const documentObs = (documentPid: string) => {
      return this.recordService.getRecord('documents', documentPid).pipe(
        map((doc: any) => doc.metadata)
      );
    };
    console.log(query, queryOptions);

    return this.recordService.getRecords(
      queryOptions.type,
      `autocomplete_barcode:${query}`,
      1,
      queryOptions.maxOfResult
    ).pipe(
      tap(result => console.log('result', result)),
      mergeMap((result: any) => {
        return from(result.hits.hits).pipe(
          mergeMap((item: any) =>
            documentObs(item.metadata.document.pid).pipe(
              map(doc => {
                return {
                  label: this.truncateTextPipe.transform(
                      this.mainTitlePipe.transform(doc.title),
                      10,
                      '…'
                    ),
                  value: this.apiService.getRefEndpoint('items', item.metadata.pid),
                  summary: item.metadata.barcode
                };
              }),
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
    const pid = url.pop();

    return this.recordService.getRecord(queryOptions.type, pid, 1)
    .pipe(
      switchMap((record: any) => {
        return this.recordService.getRecord('documents', record.metadata.document. pid)
        .pipe(
          map((document: any | Error) =>
            `<div class="pt-0">
              <div class="font-bold">${this.mainTitlePipe.transform(document.metadata.title)}</div>
              <span class="font-bold">${this.translateService.instant('Barcode')}</span>: ${record.metadata.barcode}
             </div>`
          )
        );
      })
    );
  }
}
