/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AppStore } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LocalFieldApiService } from '../api/local-field-api.service';

const typeMap: Record<string, string> = {
  documents: 'doc',
  holdings: 'hold',
  items: 'item',
};

/**
 * Guard that prevents adding a local field record when one already exists for
 * the current organisation. Redirects to /errors/400 on missing params or unknown type.
 */
export const canAddLocalFieldsGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const appStore = inject(AppStore);
  const localFieldsApiService = inject(LocalFieldApiService);
  const router = inject(Router);

  const { type, ref } = route.queryParams;
  if (!type || !ref) {
    router.navigate(['/errors/400'], { skipLocationChange: true });
    return of(false);
  }

  const mappedType = typeMap[type];
  if (!mappedType) {
    router.navigate(['/errors/400'], { skipLocationChange: true });
    return of(false);
  }

  return localFieldsApiService
    .getByResourceTypeAndResourcePidAndOrganisationId(mappedType, ref, appStore.currentOrganisationPid()!)
    .pipe(map(record => !record.metadata));
};
