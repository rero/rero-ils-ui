/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { IBucketNameService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BucketNameService implements IBucketNameService {

  private translateService: TranslateService = inject(TranslateService);

  /**
   * Transform aggregation name
   * @param aggregationKey - type of aggregation
   * @param value - value of current aggregation
   * @returns Observable of string
   */
  transform(aggregationKey: string, value: string): Observable<string> {
    switch (aggregationKey) {
      case 'language':
        return of(this.translateService.instant('lang_' + value));
      default: return of(this.translateService.instant(value));
    }
  }
}
