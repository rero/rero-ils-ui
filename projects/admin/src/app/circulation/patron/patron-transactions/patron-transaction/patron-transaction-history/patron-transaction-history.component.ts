// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { PatronTransactionEventType } from '@app/admin/classes/patron-transaction';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Timeline } from 'primeng/timeline';
import { NgClass, AsyncPipe, CurrencyPipe } from '@angular/common';
import { Tag } from 'primeng/tag';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-patron-transaction-history',
    templateUrl: './patron-transaction-history.component.html',
    imports: [Bind, Timeline, NgClass, Tag, AsyncPipe, CurrencyPipe, DateTranslatePipe, GetRecordPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatronTransactionHistoryComponent {

  private translateService: TranslateService = inject(TranslateService);
  private appStore = inject(AppStore);

  events = input.required<any[]>();

  patronTransactionEventType = PatronTransactionEventType;

  get organisation() {
    return this.appStore.organisation();
  }

  eventLabel(event: any): string {
    return (event.subtype)
      ? `${this.translateService.instant(event.type.toString())} [${this.translateService.instant(event.subtype)}]`
      : this.translateService.instant(event.type.toString());
  }

  tagSeverity(event: any) {
    switch(event.type) {
      case this.patronTransactionEventType.FEE:
        return 'danger';
      case this.patronTransactionEventType.PAYMENT:
        return 'success';
      case this.patronTransactionEventType.CANCEL:
        return 'info';
    }
  }

  hideShowEye(event: string): boolean {
    return document.getElementById(event).hidden;
  }

  hideShowEvent(event: string): void {
    const element = document.getElementById(event);
    element.hidden = !element.hidden;
  }
}
