// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Item } from '@app/admin/classes/items';
import { PatronTransaction } from '@app/admin/classes/patron-transaction';
import { TranslatePipe } from '@ngx-translate/core';
import { DateTranslatePipe, GetRecordPipe, RecordService, TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-overdue-transaction-detail',
  templateUrl: './overdue-transaction-detail.component.html',
  imports: [TranslatePipe, RouterLink, AsyncPipe, DateTranslatePipe, GetRecordPipe, MainTitlePipe, TruncateTextPipe],
})
export class OverdueTransactionDetailComponent {
  private recordService = inject(RecordService);

  transaction = input<PatronTransaction>();

  readonly item = toSignal(
    toObservable(this.transaction).pipe(
      switchMap((t) => {
        if (!t?.loan?.pid) return of(null);
        return this.recordService.getRecord('loans', t.loan.pid, {}).pipe(
          map((data) => data.metadata),
          mergeMap((data) => this.recordService.getRecord('items', (data as any).item_pid.value, {})),
          map((data) => new Item(data.metadata)),
        );
      }),
    ),
    { initialValue: null },
  );
}
