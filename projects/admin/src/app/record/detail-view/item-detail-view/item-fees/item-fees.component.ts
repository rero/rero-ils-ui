// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { PatronTransactionApiService } from '@app/admin/api/patron-transaction-api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Panel } from '@openng/optimus-ui/panel';
import { Tag } from '@openng/optimus-ui/tag';
import { GetRecordPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'admin-item-fees',
  templateUrl: './item-fees.component.html',
  imports: [TranslatePipe, Bind, Panel, Tag, RouterLink, AsyncPipe, CurrencyPipe, GetRecordPipe],
})
export class ItemFeesComponent {
  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private appStore = inject(AppStore);

  readonly itemPid = input<string>();

  private readonly _fees = toSignal(
    toObservable(this.itemPid).pipe(
      switchMap((pid) => (pid ? this.patronTransactionApiService.getActiveFeesByItemPid(pid) : of([]))),
    ),
    { initialValue: [] },
  );

  readonly fees = computed(() => this._fees() as any[]);
  readonly total = computed(() => this.fees().reduce((sum: number, fee: any) => sum + fee.metadata.total_amount, 0));

  get organisation() {
    return this.appStore.organisation();
  }
}
