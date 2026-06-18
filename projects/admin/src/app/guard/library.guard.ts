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
): Observable<boolean> {
  return owningLibrary$.pipe(
    map((owningLibrary: string) => {
      if (owningLibrary !== appStore.currentLibraryPid()) {
        router.navigate(['/errors/403'], { skipLocationChange: true });
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/errors/500'], { skipLocationChange: true });
      return of(false);
    })
  );
}

/**
 * Guard that checks if the current user belongs to the library passed via the
 * `library` query parameter. Redirects to /errors/403 if denied, /errors/500 on error.
 */
export const libraryGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const appStore = inject(AppStore);
  const router = inject(Router);
  return checkLibraryAccess(of(route.queryParams.library), appStore, router);
};
