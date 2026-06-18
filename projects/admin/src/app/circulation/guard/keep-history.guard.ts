// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
