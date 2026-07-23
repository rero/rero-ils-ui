// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CONFIG, RecordService } from '@rero/ng-core';
import { patchState, signalStore, withMethods, withProps, withState } from '@ngrx/signals';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize, Observable, Subject, take } from 'rxjs';

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
        acceptLabel: store.translateService.instant('Delete'),
        rejectLabel: store.translateService.instant('Cancel'),
        message: store.translateService.instant('Do you really want to delete this record?'),
        header: store.translateService.instant('Confirmation'),
        icon: 'fa fa-exclamation-triangle fa-2x core:text-red-500',
        acceptButtonStyleClass: 'core:bg-red-500 core:border-red-500',
        rejectButtonStyleClass: 'p-button-text',
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
);
