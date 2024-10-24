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
import { IQueryOptions, ISuggestionItem } from '@rero/ng-core/lib/record/editor/formly/primeng/remote-autocomplete/remote-autocomplete.interface';
import { catchError, map, Observable, of } from 'rxjs';
import { PatronService } from '@app/admin/service/patron.service';

@Injectable({
  providedIn: 'root'
})
export class PatronsRemoteService implements IRemoteAutocomplete {

  private recordService: RecordService = inject(RecordService);
  private patronService: PatronService = inject(PatronService);
  private apiService: ApiService = inject(ApiService);

  getName(): string {
    return 'patrons';
  }

  getSuggestions(query: string, queryOptions: IQueryOptions, currentPid: string): Observable<ISuggestionItem[]> {
    if (!query) {
      return of([]);
    }

    return this.recordService.getRecords(
      this.getName(),
      query,
      1,
      queryOptions.maxOfResult
    ).pipe(
      map((result: any) => {
        const patrons = [];
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
    const url = item.value.split('/');
    const pid = url.pop();

    return this.recordService
      .getRecord(queryOptions.type, pid, 1)
      .pipe(
        map((data: any) =>
          `<span class="bg-light p-2 font-bold">${this.patronService.getFormattedName(data.metadata)}</span>`
        )
      );
  }

  private getPatronsRef(metadata: any, query: string): ISuggestionItem {
    return {
      label: this.patronService.getFormattedName(metadata),
      value: this.apiService.getRefEndpoint(this.getName(), metadata.pid)
    };
  }
}
