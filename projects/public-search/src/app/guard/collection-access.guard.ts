// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
