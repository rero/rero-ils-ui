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
import { Inject, Injectable } from '@angular/core';
import { RecordService, SuggestionMetadata } from '@rero/ng-core';
import { TranslateService } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class MefTypeahead {
  /**
   * Constructor
   * @param _recordService - RecordService
   * @param _translateService - TranslateService
   */
  constructor(
    @Inject(RecordService) private _recordService: RecordService,
    @Inject(TranslateService) private _translateService: TranslateService
  ) { }

  /**
   * Convert the input value (i.e. $ref url) into a template html code.
   * @param options - remote typeahead options
   * @param value - formControl value i.e. $ref value
   * @returns Observable of string - html template representation of the value.
   */
  getValueAsHTML(options: any, value: string): Observable<string> {
    const url = value.split('/');
    const pid = url.pop();
    const source = url.pop();
    let query = `${source}.pid:${pid}`;
    switch (source) {
      case 'mef':
        query = `pid:${pid}`;
        break;
      case 'viaf':
        query = `viaf_pid:${pid}`;
        break;
    }
    return this._recordService
      .getRecords(options.type, query, 1, 1)
      .pipe(
        map((data: any) => {
          if (
            data.hits.hits.length > 0 &&
            data.hits.hits[0].metadata[source].authorized_access_point_representing_a_person
          ) {
            return {
              source: source.toUpperCase(),
              name: data.hits.hits[0].metadata[source].authorized_access_point_representing_a_person
            };
          }
        }),
        map((v: { name: string, source: string }) => `
          <strong>${v.name}</strong>
          <small class="badge badge-secondary ml-1">${v.source}</small>
        `)
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
        'mef',
        `\\*.preferred_name_for_person:'${query}'`,
        1,
        numberOfSuggestions
      ).pipe(
        map((results: any) => {
          const names = [];
          if (!results) {
            return [];
          }
          results.hits.hits.map((hit: any) => {
            for (const source of ['idref', 'gnd']) {
              if (hit.metadata[source]) {
                names.push(this._getNameRef(hit.metadata, source));
              }
            }
          });
          return names;
        })
      );
  }

  /**
   * Returns label, $ref and group.
   *
   * @param metadata the meta data.
   * @param sourceName The name of the source.
   * @return Metadata the label, $ref and group.
   */
  private _getNameRef(metadata: any, sourceName: string): SuggestionMetadata {
    return {
      label: metadata[sourceName].authorized_access_point_representing_a_person,
      value: `https://mef.rero.ch/api/${sourceName}/${metadata[sourceName].pid}`,
      group: this._translateService.instant(
        'link to authority {{ sourceName }}',
        { sourceName }
      )
    };
  }
}
