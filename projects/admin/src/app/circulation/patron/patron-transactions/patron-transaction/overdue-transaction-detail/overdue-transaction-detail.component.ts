/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
 * Copyright (C) 2019-2023 UCLouvain
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
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Item } from '@app/admin/classes/items';
import { PatronTransaction } from '@app/admin/classes/patron-transaction';
import { DateTranslatePipe, GetRecordPipe, RecordService, TruncateTextPipe } from '@rero/ng-core';
import { MainTitlePipe } from '@rero/shared';
import { TranslateDirective } from '@ngx-translate/core';
import { AsyncPipe } from '@angular/common';
import { of } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'admin-overdue-transaction-detail',
  templateUrl: './overdue-transaction-detail.component.html',
  imports: [TranslateDirective, RouterLink, AsyncPipe, DateTranslatePipe, GetRecordPipe, MainTitlePipe, TruncateTextPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverdueTransactionDetailComponent {

  private recordService = inject(RecordService);

  transaction = input<PatronTransaction>();

  readonly item = toSignal(
    toObservable(this.transaction).pipe(
      switchMap(t => {
        if (!t?.loan?.pid) return of(null);
        return this.recordService.getRecord('loans', t.loan.pid, {}).pipe(
          map(data => data.metadata),
          mergeMap(data => this.recordService.getRecord('items', (data as any).item_pid.value, {})),
          map(data => new Item(data.metadata))
        );
      })
    ),
    { initialValue: null }
  );
}
