// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AppStore } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

/**
 * Shared helper: checks that `owningLibrary$` emits the current user's library.
 * Services must be injected by the caller and passed explicitly.
 */
export function checkLibraryAccess(
  owningLibrary$: Observable<string>,
  appStore: InstanceType<typeof AppStore>,
  router: Router
) {
  return owningLibrary$.pipe(
    map((owningLibrary: string) => {
      if (owningLibrary !== appStore.currentLibraryPid()) {
        return router.createUrlTree(['/errors/403']);
      }
      return true;
    }),
    catchError(() => of(router.createUrlTree(['/errors/500'])))
  );
}

/**
 * Guard that checks if the current user belongs to the library passed via the
 * `library` query parameter. Redirects to /errors/403 if denied, /errors/500 on error.
 */
export const libraryGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const appStore = inject(AppStore);
  const router = inject(Router);
  return checkLibraryAccess(of(route.queryParams.library), appStore, router);
};
