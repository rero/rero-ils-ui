// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AppStore } from '@rero/shared';
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
export const canAddLocalFieldsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const appStore = inject(AppStore);
  const localFieldsApiService = inject(LocalFieldApiService);
  const router = inject(Router);

  const { type, ref } = route.queryParams;
  if (!type || !ref) {
    return router.createUrlTree(['/errors/400']);
  }

  const mappedType = typeMap[type];
  if (!mappedType) {
    return router.createUrlTree(['/errors/400']);
  }

  return localFieldsApiService
    .getByResourceTypeAndResourcePidAndOrganisationId(mappedType, ref, appStore.currentOrganisationPid()!)
    .pipe(map(record => !record.metadata));
};
