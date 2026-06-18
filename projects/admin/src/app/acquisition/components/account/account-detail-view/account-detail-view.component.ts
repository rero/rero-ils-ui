// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, input, ChangeDetectionStrategy} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgClass, AsyncPipe, CurrencyPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { NegativeAmountPipe } from '../../../pipes/negative-amount.pipe';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';

@Component({
    selector: 'admin-acquisition-account-detail-view',
    templateUrl: './account-detail-view.component.html',
    imports: [TranslateDirective, RouterLink, NgClass, AsyncPipe, CurrencyPipe, GetRecordPipe, TranslatePipe, NegativeAmountPipe, MessageModule, PanelModule],
  changeDetection: ChangeDetectionStrategy.OnPush
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
      switchMap((data: any) => this.acqAccountApiService.getAccount(data.metadata.pid))
    ),
    { initialValue: null }
  );

  // GETTER & SETTER ============================================================
  /** Get the current budget pid for the organisation */
  get organisation(): any {
    return this.appStore.organisation();
  }
}
