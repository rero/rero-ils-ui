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
import { AppConfigService } from '../app-config.service';

export const collectionAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
  const appConfigService = inject(AppConfigService);
  const router = inject(Router);

  const viewcode = route.params['viewcode'] ?? route.parent?.params['viewcode'];
  if (appConfigService.globalViewName === viewcode) {
    router.navigate(['/errors/403'], { skipLocationChange: true });
    return false;
  }
  return true;
};
