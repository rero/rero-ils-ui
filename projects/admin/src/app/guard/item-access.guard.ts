// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG, extractIdOnRef, RecordService } from '@rero/ng-core';
import type { EsResult } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/**
 * Guard that checks whether the current user's library owns the holding
 * linked to the given item. Redirects to `/` with a warning toast if denied.
 */
export const itemAccessGuard: CanActivateFn = (route: ActivatedRouteSnapshot): Observable<boolean> => {
  const router = inject(Router);
  const appStore = inject(AppStore);
  const recordService = inject(RecordService);
  const translateService = inject(TranslateService);
  const messageService = inject(MessageService);

  const deny = (detailKey: string): boolean => {
    messageService.add({
      severity: 'warn',
      summary: translateService.instant('item'),
      detail: translateService.instant(detailKey),
      life: CONFIG.MESSAGE_LIFE,
    });
    router.navigate(['/']);
    return false;
  };

  return recordService.getRecord('items', route.params.pid).pipe(
    map((data: any) => extractIdOnRef(data.metadata.holding.$ref)),
    switchMap((holdingPid: string) =>
      recordService.getRecords('holdings', { query: `pid:${holdingPid}`, page: 1, itemsPerPage: 1 }).pipe(
        map((result: EsResult) =>
          recordService.totalHits(result.hits.total) === 0 ? null : result.hits.hits[0]
        ),
        map((data: any) => {
          if (data === null) {
            return deny('Access denied');
          }
          if (appStore.currentLibraryPid() !== data.metadata.library.pid) {
            return deny('Access denied');
          }
          return true;
        })
      )
    ),
    map((result): boolean => {
      if (result === false || result === null) {
        return deny('Item not found');
      }
      return result as boolean;
    })
  );
};
