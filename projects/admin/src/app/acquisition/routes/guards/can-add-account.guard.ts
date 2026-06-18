// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { canAdd } from './abstract-can-add.guard';

/**
 * Guard that allows adding an account only when the `budget` query param
 * is present and the budget belongs to the current fiscal year.
 */
export const canAddAccountGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const router = inject(Router);

  const budgetPid = route.queryParams.budget;
  if (!budgetPid) {
    router.navigate(['/errors/400'], { skipLocationChange: true });
    return of(false);
  }
  return canAdd('budgets', budgetPid);
};
