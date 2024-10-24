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
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { IBucketNameService } from '@rero/ng-core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LibraryApiService } from '../api/library-api.service';
import { OrganisationApiService } from '../api/organisation-api.service';

@Injectable({
  providedIn: 'root'
})
export class BucketNameService implements IBucketNameService {

  private translateService: TranslateService = inject(TranslateService);
  private organisationApiService: OrganisationApiService = inject(OrganisationApiService);
  private libraryApiService: LibraryApiService = inject(LibraryApiService);

  /**
   * Transform aggregation name
   * @param aggregationKey - type of aggregation
   * @param value - value of current aggregation
   * @returns Observable of string
   */
  transform(aggregationKey: string, value: string): Observable<string> {
    switch (aggregationKey) {
      case 'claims_count':
        const claims_label = Number(value) < 2 ? _('{{count}} claim') : _('{{count}} claims');
        return of(this.translateService.instant(claims_label, { count: value }));
      case 'language': return of(this.translateService.instant(`lang_${value}`));
      case 'owning_library':
      case 'transaction_library':
      case 'library': return this.libraryApiService.getByPid(value).pipe(map(record => record.name));
      case 'organisation': return this.organisationApiService.getByPid(value).pipe(map(record => record.name));
      default: return of(this.translateService.instant(value));
    }
  }
}
