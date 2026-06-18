// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PatronTransactionApiService } from '@app/admin/api/patron-transaction-api.service';
import { of, switchMap } from 'rxjs';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { TranslateDirective } from '@ngx-translate/core';
import { Tag } from 'primeng/tag';
import { RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { GetRecordPipe } from '@rero/ng-core';
import { AppStore } from '@rero/shared';

@Component({
    selector: 'admin-item-fees',
    templateUrl: './item-fees.component.html',
    imports: [Bind, Panel, TranslateDirective, Tag, RouterLink, AsyncPipe, CurrencyPipe, GetRecordPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ItemFeesComponent {

  private patronTransactionApiService: PatronTransactionApiService = inject(PatronTransactionApiService);
  private appStore = inject(AppStore);

  readonly itemPid = input<string>();

  private readonly _fees = toSignal(
    toObservable(this.itemPid).pipe(
      switchMap(pid => pid
        ? this.patronTransactionApiService.getActiveFeesByItemPid(pid)
        : of([])
      )
    ),
    { initialValue: [] }
  );

  readonly fees = computed(() => this._fees() as any[]);
  readonly total = computed(() =>
    this.fees().reduce((sum: number, fee: any) => sum + fee.metadata.total_amount, 0)
  );

  get organisation() {
    return this.appStore.organisation();
  }
}
