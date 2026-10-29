// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { AsyncPipe, CurrencyPipe, NgClass } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MessageModule } from '@openng/optimus-ui/message';
import { PanelModule } from '@openng/optimus-ui/panel';
import { GetRecordPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { filter, switchMap } from 'rxjs';

import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { NegativeAmountPipe } from '../../../pipes/negative-amount.pipe';

@Component({
  selector: 'admin-acquisition-account-detail-view',
  templateUrl: './account-detail-view.component.html',
  imports: [
    RouterLink,
    NgClass,
    AsyncPipe,
    CurrencyPipe,
    GetRecordPipe,
    TranslatePipe,
    NegativeAmountPipe,
    MessageModule,
    PanelModule,
  ],
})
export class AccountDetailViewComponent {
  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private appStore = inject(AppStore);

  // COMPONENT ATTRIBUTES =======================================================
  /** Record data */
  readonly record = input<any>();
  /** Resource type */
  readonly type = input<string>('');

  /** metadata from ES - much more complete than DB stored record */
  readonly esRecord = toSignal(
    toObservable(this.record).pipe(
      filter((data: any) => !!data?.metadata?.pid),
      switchMap((data: any) => this.acqAccountApiService.getAccount(data.metadata.pid)),
    ),
    { initialValue: null },
  );

  // GETTER & SETTER ============================================================
  /** Get the current budget pid for the organisation */
  get organisation(): any {
    return this.appStore.organisation();
  }
}
