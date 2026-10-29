// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { PatronTransactionEventType } from '@app/admin/classes/patron-transaction';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { Timeline } from '@openng/optimus-ui/timeline';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';

@Component({
  selector: 'admin-patron-transaction-history',
  templateUrl: './patron-transaction-history.component.html',
  imports: [Bind, Timeline, NgClass, Tag, AsyncPipe, CurrencyPipe, DateTranslatePipe, GetRecordPipe, TranslatePipe],
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
    return event.subtype
      ? `${this.translateService.instant(event.type.toString())} [${this.translateService.instant(event.subtype)}]`
      : this.translateService.instant(event.type.toString());
  }

  tagSeverity(event: any) {
    switch (event.type) {
      case this.patronTransactionEventType.FEE:
        return 'danger';
      case this.patronTransactionEventType.PAYMENT:
        return 'success';
      case this.patronTransactionEventType.CANCEL:
        return 'info';
    }
  }

  hideShowEye(event: string): boolean {
    return !!document.getElementById(event).hidden;
  }

  hideShowEvent(event: string): void {
    const element = document.getElementById(event);
    element.hidden = !element.hidden;
  }
}
