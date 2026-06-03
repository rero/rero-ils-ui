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
