// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { map, take } from 'rxjs';
import { TransactionsHistoryComponent } from '../transactions-history/transactions-history.component';

@Component({
  selector: 'admin-transactions-history-dialog',
  imports: [Button],
  templateUrl: './transactions-history-dialog.component.html',
})
export class TransactionsHistoryDialogComponent {

  private dialogService = inject(DialogService);
  private translateService = inject(TranslateService);
  private appStoreUser = inject(AppStore).user();

  /** Current language, to rebuild the label when the language changes. */
  private currentLanguage = toSignal(
    this.translateService.onLangChange.pipe(map((event: LangChangeEvent) => event.lang)),
    { initialValue: this.translateService.getCurrentLang() }
  );

  protected label = computed(() => {
    this.currentLanguage();
    return this.translateService.instant('Operation history') + ' (' + this.appStoreUser.fullname + ')';
  });

  openDialog(): void {
    const dialogRef = this.dialogService.open(TransactionsHistoryComponent, {
      header: this.label(),
      modal: true,
      closable: true,
      width: '60vw',
      contentStyle: { 'min-height': '10rem' },
      position: 'top',
    });

    dialogRef?.onChildComponentLoaded
      .pipe(take(1))
      .subscribe((component: TransactionsHistoryComponent) => {
        component.closeRequested.subscribe(() => dialogRef.close());
      });
  }
}
