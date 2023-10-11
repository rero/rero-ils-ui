/*
 * RERO ILS UI
 * Copyright (C) 2021-2023 RERO
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
import { Injectable } from '@angular/core';
import { IBucketNameService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { OrganisationApiService } from '../api/organisation-api.service';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class BucketNameService implements IBucketNameService {

  /**
   * Constructor
   * @param translateService - TranslateService
   * @param organisationApiService - OrganisationApiService
   */
  constructor(
    private translateService: TranslateService,
    private organisationApiService: OrganisationApiService
  ) { }

  /**
   * Tranform aggregation name
   * @param aggregationKey - type of aggregation
   * @param value - value of current aggregation
   * @returns Observable of string
   */
  transform(aggregationKey: string, value: string): Observable<string> {
    switch (aggregationKey) {
      case 'language': return of(this.translateService.instant(`lang_${value}`));
      case 'organisation': return this.organisationApiService.getByPid(value).pipe(map(record => record.name));
      default: return of(this.translateService.instant(value));
    }
  }
}
