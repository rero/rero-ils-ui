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
import { APP_BASE_HREF } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { ApiService, RecordService } from '@rero/ng-core';
import { IQueryOptions, ISuggestionItem } from '@rero/prime/remote-autocomplete/remote-autocomplete.interface';
import { Entity, MainTitlePipe } from '@rero/shared';
import { catchError, map, Observable, of } from 'rxjs';
import { IRemoteAutocomplete } from './i-remote-autocomplete';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DocumentsRemoteService implements IRemoteAutocomplete {

  private translateService: TranslateService = inject(TranslateService);
  private recordService: RecordService = inject(RecordService);
  private mainTitlePipe: MainTitlePipe = inject(MainTitlePipe);
  private apiService: ApiService = inject(ApiService);
  private baseHref = inject(APP_BASE_HREF);

  getName(): string {
    return 'documents';
  }

  getSuggestions(query: string, queryOptions: IQueryOptions, currentPid: string): Observable<ISuggestionItem[]> {
    if (!query) {
      return of([]);
    }

    let queryString = `((autocomplete_title:${query})^2 OR ${query})`;
    const additionalQuery = [];
    if (queryOptions.filter) {
      additionalQuery.push(queryOptions.filter);
    }
    if (currentPid) {
      additionalQuery.push(`NOT pid:${currentPid}`);
    }
    if (additionalQuery.length > 0) {
      queryString += ' ' + additionalQuery.join(' ');
    }

    return this.recordService
      .getRecords(this.getName(), queryString, 1, queryOptions.maxOfResult)
      .pipe(
        map((result: any) => {
          if (result.hits.total.value == 0) {
            return [];
          }
          const hits = [];
          result.hits.hits.map((hit: any) => {
            hits.push(this.processHit(hit.metadata, queryOptions));
          });

          return hits
        }),
        catchError(e => {
          switch (e.status) {
            case 400:
              return [];
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
          `<span class="bg-light p-2"><strong>${this.mainTitlePipe.transform(data.metadata.title)}</strong></span>`
        )
      );
  }

  private processHit(metadata: any, queryOptions: IQueryOptions): ISuggestionItem {
    let summary = [];
    const baseHref = this.baseHref.replace(/\/$/, '');
    if (metadata.contribution) {
      summary.push(this.processContribution(metadata.contribution));
    }
    if (('identifiedBy' in metadata)) {
      summary.push(this.processIdentifiedBy(metadata.identifiedBy));
    }
    return {
      label: this.processTitle(metadata.title),
      value: this.apiService.getRefEndpoint(this.getName(), metadata.pid),
      summary: summary.length > 0 ? summary.join('<br>') : undefined,
      link: `${baseHref}/records/documents/detail/${metadata.pid}`
    }
  }

  private processContribution(contributions: any): string | undefined {
    const authorized = 'authorized_access_point';
    const key = `${authorized}_${this.translateService.currentLang}`;
    const contrib = [];
    contributions.map((contribution: any) => {
      const keys = Object.keys(contribution.entity);
      if (contribution.entity && (keys.includes(key) || keys.includes(authorized))) {
        const icon = `<i class="fa ${Entity.getIcon(contribution.entity.type)}" title="${this.translateService.instant(contribution.entity.type)}"></i>`;
        if (keys.includes(key)) {
          contrib.push(`${icon} ` + contribution.entity[keys.includes(key) ? key : authorized]);
        }
      }
    });

    return contrib.length > 0 ? contrib.join('<br>'): undefined;
  }

  private processTitle(title: any, maxLengthSuggestion: number = 100): string {
    let text = this.mainTitlePipe.transform(title);
    // Truncate text if the length of text great than maxLengthSuggestion
    if (text.length > maxLengthSuggestion) {
      text = text.slice(0, maxLengthSuggestion) + '…';
    }

    return `<b>${text}</b>`;
  }

  private processIdentifiedBy(identifiedBy: any): string {
    const ids = [];
      const identifiers = this.extractIdentifier(identifiedBy);
      const keys = Object.keys(identifiers);
      keys.forEach((key: string) => {
        ids.push(`${key}: ${identifiers[key].join(', ')}`);
      });
      return `<small>${ids.join(' / ')}</small>`;
  }

  private extractIdentifier(identifiers: any) {
    const availableIdentifiers = {
      'bf:Ean': 'ISBN',
      'bf:Isbn': 'ISBN',
      'bf:Issn': 'ISSN',
      'bf:IssnL': 'ISSN'
    };
    const keys = Object.keys(availableIdentifiers);
    const result: Record<string, any> = {};
    identifiers
      .filter((identifier: any) => keys.includes(identifier.type))
      .forEach((element: any) => {
        let data = element.value;
        const key = availableIdentifiers[element.type];
        if (!(key in result)) {
          result[key] = new Set();
        }
        if ('qualifier' in element) {
          data += ` (${element.qualifier})`;
        }
        result[key].add(data);
      });
    for (const [key, value] of Object.entries(result)) {
      result[key] = Array.from(value);  // convert set to list
    }
    return result;
  }
}
