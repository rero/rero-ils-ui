/*
 * RERO ILS UI
 * Copyright (C) 2024 RERO
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
import { CanActivateFn, Router } from '@angular/router';
import { PatronService } from '@app/admin/service/patron.service';
import { map } from 'rxjs';

export const keepHistoryGuard: CanActivateFn = (route, state) => {
  const patronService: PatronService = inject(PatronService);
  const router: Router = inject(Router);

  const patronPid = state.url.split('/').splice(-2)[0];
  return patronService.getPatron(patronPid).pipe(map((patron: any) => {
    if (!patron.keep_history) {
      router.navigate(['/errors/403'], { skipLocationChange: true });
    }
    return patron.keep_history
  }));
};
