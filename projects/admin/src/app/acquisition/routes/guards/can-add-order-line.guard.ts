// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
