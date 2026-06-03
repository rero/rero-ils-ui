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
