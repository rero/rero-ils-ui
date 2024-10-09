/*
 * RERO ILS UI
 * Copyright (C) 2020-2024 RERO
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
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '@rero/shared';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LibraryGuard  {

  protected userService: UserService = inject(UserService);
  protected router: Router = inject(Router);

  /**
   * Check if the current logged user is linked to the same library than the desired resource.
   * If access is denied --> 403 : forbidden
   * If error occurred --> 500 : Internal server error
   */
  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> {
    return this.getOwningLibrary$(next).pipe(
      map((owningLibrary: string) => {
        if (owningLibrary !== this.userService.user.currentLibrary) {
          this.router.navigate(['/errors/403'], { skipLocationChange: true });
          return false;
        }
        return true;
      }),
      catchError(() => this.router.navigate(['/errors/500'], { skipLocationChange: true }))
    );
  }

  /**
   * Return the library associated to the resource
   * @param route: the current URL route
   * @return the library pid linked to the resource from the 'library' query parameters
   */
  getOwningLibrary$(route: ActivatedRouteSnapshot): Observable<string> {
    return of(route.queryParams.library);
  }
}
