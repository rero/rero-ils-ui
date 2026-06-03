/*
 * RERO ILS UI
 * Copyright (C) 2022-2025 RERO
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
import { Observable, of } from 'rxjs';
import { canAdd } from './abstract-can-add.guard';

/**
 * Guard that allows adding an order line only when the `order` query param
 * is present and the order belongs to the current fiscal year.
 */
export const canAddOrderLineGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const router = inject(Router);

  const orderPid = route.queryParams.order;
  if (!orderPid) {
    router.navigate(['/errors/400'], { skipLocationChange: true });
    return of(false);
  }
  return canAdd('acq_orders', orderPid);
};
