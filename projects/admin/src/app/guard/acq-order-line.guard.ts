// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { extractIdOnRef, RecordService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { map } from 'rxjs/operators';
import { checkLibraryAccess } from './library.guard';

/**
 * Guard that checks if the current user's library matches the library of the
 * acquisition order referenced by the `order` query param (or `pid` route param).
 */
export const acqOrderLineGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
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
