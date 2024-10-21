/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { inject, Pipe, PipeTransform } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'itemHoldingsCallNumber'
})
export class ItemHoldingsCallNumberPipe implements PipeTransform {

  protected recordService: RecordService = inject(RecordService);

  /**
   * Get item call numbers
   * @return object: first, second are the item first, second call numbers.
   */
  transform(record: any): Observable<any> {
    if ('metadata' in record) {
      record = record.metadata;
    }
    if (record.call_number) {
      return of({
        first: {
          source: 'item',
          value: record.call_number
        },
        second: {
          source: 'item',
          value: record.second_call_number
        }
      });
    } else {
      return this.recordService.getRecord('holdings', record.holding.pid, 1).pipe(map((data: any) => {
        if (data && data.metadata && 'call_number' in data.metadata) {
          return {
            first: {
              source: 'holding',
              value: data.metadata.call_number
            },
            second: {
              source: 'item',
              value: record.second_call_number
            }
          };
        } else {
          return {
            first: {
              source: undefined,
              value: undefined
            },
            second: {
              source: undefined,
              value: undefined
            }
          };
        }
      }));
    }
  }
}
