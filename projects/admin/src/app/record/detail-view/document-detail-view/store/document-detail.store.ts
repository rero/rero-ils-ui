// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RecordPermissions } from '@app/admin/classes/permissions';
import { RecordPermissionService } from '@app/admin/service/record-permission.service';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { TranslateService } from '@ngx-translate/core';
import { ActionStatus, CONFIG, RecordService } from '@rero/ng-core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { combineLatest, filter, finalize, map, Observable, of, Subject, switchMap, take, tap } from 'rxjs';

type DocumentDetailState = {
  holdingsTotal: number | null;
  isDeletingChild: boolean;
};

const initialState: DocumentDetailState = {
  holdingsTotal: null,
  isDeletingChild: false,
};

export const DocumentDetailStore = signalStore(
  withState<DocumentDetailState>(initialState),
  withProps(() => ({
    confirmationService: inject(ConfirmationService),
    messageService: inject(MessageService),
    recordPermissionService: inject(RecordPermissionService),
    recordService: inject(RecordService),
    translateService: inject(TranslateService),
  })),
  withMethods((store) => ({
    clearHoldingsTotal(): void {
      patchState(store, { holdingsTotal: null });
    },
    setHoldingsTotal(total: number): void {
      patchState(store, { holdingsTotal: total });
    },
    setChildDeletePending(): void {
      patchState(store, { isDeletingChild: true });
    },
    setChildDeleteDone(): void {
      patchState(store, { isDeletingChild: false });
    },
    deleteChildRecord(type: string, pid: string): Observable<boolean> {
      const delete$ = new Subject<boolean>();
      store.confirmationService.confirm({
        key: 'document-detail-child-delete',
        accept: () => {
          patchState(store, { isDeletingChild: true });
          store.recordService.delete(type, pid).pipe(
            take(1),
            finalize(() => patchState(store, { isDeletingChild: false }))
          ).subscribe({
            next: () => {
              delete$.next(true);
              delete$.complete();
              store.messageService.add({
                severity: 'info',
                summary: store.translateService.instant('Confirmed'),
                detail: store.translateService.instant('Record deleted.'),
                life: CONFIG.MESSAGE_LIFE,
              });
            },
            error: (error) => {
              delete$.next(false);
              delete$.complete();
              store.messageService.add({
                severity: 'error',
                summary: store.translateService.instant('Error'),
                detail: store.translateService.instant(error.title),
                sticky: true,
                closable: true,
              });
            },
          });
        },
        reject: () => {
          delete$.next(false);
          delete$.complete();
        },
      });
      return delete$.asObservable();
    },
  })),
  withMethods((store) => {
    let activeDocumentPid: string | null = null;

    const _clearHoldingsTotalOnDocumentChange = (pid: any): void => {
      const documentPid = pid == null ? null : String(pid);
      if (documentPid !== activeDocumentPid) {
        activeDocumentPid = documentPid;
        store.clearHoldingsTotal();
      }
    };

    const _deletePermissionToActionStatus = (permission: RecordPermissions): ActionStatus => {
      const canDelete = permission.delete?.can ?? false;
      return {
        can: canDelete,
        message: canDelete
          ? ''
          : store.recordPermissionService.generateTooltipMessage(permission.delete?.reasons, 'delete'),
      };
    };

    return {
      refreshedDeleteStatus(
        recordSignal: Signal<any>,
        deleteStatus: Signal<ActionStatus>
      ): Signal<ActionStatus> {
        return toSignal(
          combineLatest([
            toObservable(recordSignal).pipe(
              tap((record) => _clearHoldingsTotalOnDocumentChange(record?.metadata?.pid))
            ),
            toObservable(store.holdingsTotal),
          ]).pipe(
            filter(([record, holdingsTotal]) => !record?.metadata?.pid || holdingsTotal != null),
            switchMap(([record, holdingsTotal]) => {
              const pid = record?.metadata?.pid;
              if (!pid) {
                return of(deleteStatus());
              }
              if (holdingsTotal! > 0) {
                return of({
                  can: false,
                  message: store.recordPermissionService.generateTooltipMessage(
                    { links: { holdings: holdingsTotal! } },
                    'delete'
                  ),
                });
              }
              return store.recordPermissionService
                .getPermission('documents', String(pid))
                .pipe(map((permission) => _deletePermissionToActionStatus(permission)));
            })
          ),
          { initialValue: { can: false, message: '' } }
        );
      },
    };
  }),
);
