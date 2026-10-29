// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Tag } from '@openng/optimus-ui/tag';
import { Timeline } from '@openng/optimus-ui/timeline';
import { DateTranslatePipe, GetRecordPipe } from '@rero/ng-core';
import {
  ContributionComponent,
  OpenCloseButtonComponent,
  OperationLogsApiService,
  ProvisionActivityType,
} from '@rero/shared';

@Component({
  selector: 'admin-history-log',
  templateUrl: './history-log.component.html',
  imports: [
    OpenCloseButtonComponent,
    RouterLink,
    Bind,
    Tag,
    ContributionComponent,
    Timeline,
    NgClass,
    NgTemplateOutlet,
    AsyncPipe,
    DateTranslatePipe,
    GetRecordPipe,
    TranslatePipe,
  ],
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
