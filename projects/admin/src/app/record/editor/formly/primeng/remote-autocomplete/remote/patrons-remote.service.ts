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
import { IRemoteAutocomplete } from './i-remote-autocomplete';
import { ApiService, RecordService } from '@rero/ng-core';
import { IQueryOptions, ISuggestionItem } from '@rero/ng-core';
import { catchError, map, Observable, of } from 'rxjs';
import { formatPatronName } from '@app/admin/utils/patron.utils';

@Injectable({
  providedIn: 'root'
})
export class PatronsRemoteService implements IRemoteAutocomplete {

  private recordService: RecordService = inject(RecordService);
  private apiService: ApiService = inject(ApiService);

  getName(): string {
    return 'patrons';
  }

  getSuggestions(query: string, queryOptions: IQueryOptions, _currentPid: string | null): Observable<ISuggestionItem[]> {
    if (!query) {
      return of([]);
    }

    return this.recordService.getRecords(
      this.getName(),
      { query, page: 1, itemsPerPage: queryOptions.maxOfResult }
    ).pipe(
      map((result: any) => {
        const patrons: ISuggestionItem[] = [];
        result.hits.hits.map((hit: any) => patrons.push(this.getPatronsRef(hit.metadata, query)));

        return patrons;
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
  getValueAsHTML(queryOptions: IQueryOptions, item: ISuggestionItem): Observable<string> {
    const url = item.value!.split('/');
    const pid = url.pop()!;

    return this.recordService
      .getRecord(queryOptions.type, pid, { resolve: 1 })
      .pipe(
        map((data: any) =>
          `<span class="ui:p-2 ui:font-bold">${formatPatronName(data.metadata)}</span>`
        )
      );
  }

  private getPatronsRef(metadata: any, _query: string): ISuggestionItem {
    return {
      label: formatPatronName(metadata),
      value: this.apiService.getRefEndpoint(this.getName(), metadata.pid)
    };
  }
}
