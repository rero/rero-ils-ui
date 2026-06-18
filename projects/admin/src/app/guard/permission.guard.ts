// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AppStore, PERMISSION_OPERATOR } from '@rero/shared';

/**
 * Functional guard checking whether the logged-in user holds the required
 * permissions declared in route data.
 *
 * Available values for operator: 'and' | 'or'  (default: 'or')
 *
 * USAGE:
 * { path: 'new',
 *   component: MyComponent,
 *   canActivate: [permissionGuard],
 *   data: {
 *     permissions: ['xxx', 'yyy'],
 *     operator: 'and'
 *   }
 * }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot): boolean => {
  const appStore = inject(AppStore);
  const router = inject(Router);

  const permissions: string[] = route.data['permissions'] ?? [];
  const operator: string = route.data['operator'] ?? PERMISSION_OPERATOR.OR;

  const result = appStore.canAccess(permissions, operator);
  if (!result) {
    router.navigate(['/errors/403'], { skipLocationChange: true });
    return false;
  }

  return true;
};
