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
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { checkLibraryAccess } from './library.guard';

/**
 * Guard that checks if the current user's library matches the library of the
 * acquisition order referenced by the `order` query param (or `pid` route param).
 */
export const acqOrderLineGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const recordService = inject(RecordService);
  const appStore = inject(AppStore);
  const router = inject(Router);

  const orderPid = route.queryParams.order ?? route.params.pid;
  const owningLibrary$ = recordService.getRecord('acq_orders', orderPid).pipe(
    map(data => data.metadata || {}),
    map(metadata => metadata.library || {}),
    map(library => extractIdOnRef((library as any)?.$ref))
  );

  return checkLibraryAccess(owningLibrary$, appStore, router);
};
