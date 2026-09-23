// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { Button } from 'primeng/button';
import { DialogService } from 'primeng/dynamicdialog';
import { take } from 'rxjs';
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

  protected label = signal(this.translateService.instant('Operation history') + ' (' + this.appStoreUser.fullname + ')');

  openDialog(): void {
    const dialogRef = this.dialogService.open(TransactionsHistoryComponent, {
      header: this.label(),
      modal: true,
      closable: true,
      width: '60vw',
      contentStyle: { 'min-height': '10rem' },
      position: 'top',
      inputValues: {
        userPid: this.appStoreUser.patronLibrarian?.pid
      }
    });

    dialogRef?.onChildComponentLoaded
      .pipe(take(1))
      .subscribe((component: TransactionsHistoryComponent) => {
        component.closeRequested.subscribe(() => dialogRef.close());
      });
  }
}
