/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { NgClass, AsyncPipe, CurrencyPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { CentsCurrencyPipe } from '../../../pipes/cents-currency.pipe';
import { NegativeAmountPipe } from '../../../pipes/negative-amount.pipe';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';

@Component({
    selector: 'admin-acquisition-account-detail-view',
    templateUrl: './account-detail-view.component.html',
    imports: [TranslateDirective, RouterLink, NgClass, AsyncPipe, CurrencyPipe, GetRecordPipe, TranslatePipe, NegativeAmountPipe, CentsCurrencyPipe, MessageModule, PanelModule],
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
