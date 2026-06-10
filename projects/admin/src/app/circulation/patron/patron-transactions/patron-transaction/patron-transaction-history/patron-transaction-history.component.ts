/*
 * RERO ILS UI
 * Copyright (C) 2019-2025 RERO
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
import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { PatronTransactionEventType } from '@app/admin/classes/patron-transaction';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AppStore } from '@rero/shared';
import { Bind } from 'primeng/bind';
import { Timeline } from 'primeng/timeline';
import { NgClass, AsyncPipe } from '@angular/common';
import { CentsCurrencyPipe } from '../../../../../acquisition/pipes/cents-currency.pipe';
import { Tag } from 'primeng/tag';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-patron-transaction-history',
    templateUrl: './patron-transaction-history.component.html',
    imports: [Bind, Timeline, NgClass, Tag, AsyncPipe, CentsCurrencyPipe, DateTranslatePipe, GetRecordPipe, TranslatePipe],
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
