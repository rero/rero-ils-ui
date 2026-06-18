// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { ProvisionActivityType, OperationLogsApiService, OpenCloseButtonComponent, ContributionComponent } from '@rero/shared';
import { RouterLink } from '@angular/router';
import { Bind } from 'primeng/bind';
import { Tag } from 'primeng/tag';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { Timeline } from 'primeng/timeline';
import { NgClass, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';

@Component({
    selector: 'admin-history-log',
    templateUrl: './history-log.component.html',
    imports: [OpenCloseButtonComponent, RouterLink, Bind, Tag, ContributionComponent, TranslateDirective, Timeline, NgClass, NgTemplateOutlet, AsyncPipe, DateTranslatePipe, GetRecordPipe, TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryLogComponent {

  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);

  /** Log to display */
  log = input<any>();

  /** Is collapsed */
  isCollapsed = true;

  /** ProvisionActivityType reference */
  provisionActivityType = ProvisionActivityType;

  /** Checkout record operation logs */
  checkoutLoaded = false;

  events: any[] = [];

  /** Load checkout */
  loadCheckout() {
    if (!this.checkoutLoaded) {
      this.operationLogsApiService
        .getHistoryByLoanPid(this.log().metadata.loan.pid, 'checkout')
        .subscribe((log: any) => {
          this.checkoutLoaded = true;
          this.log().metadata['type'] = 'Checkin';
          this.events = [this.log().metadata];
          if (log) {
            log.metadata['type'] = 'Checkout';
            this.events.push(log.metadata);
          }
        });
    }
  }
}
