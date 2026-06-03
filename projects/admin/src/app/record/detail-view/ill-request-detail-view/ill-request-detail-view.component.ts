/*
 * RERO ILS UI
 * Copyright (C) 2019-2024 RERO
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
import { Component, computed, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { getTagSeverityFromStatus } from '@app/admin/utils/utils';
import { RecordService, TruncateTextPipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe } from '@rero/ng-core';
import { map, of, switchMap } from 'rxjs';
import { Bind } from 'primeng/bind';
import { Panel } from 'primeng/panel';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Tag } from 'primeng/tag';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'admin-ill-request-detail-view',
    templateUrl: './ill-request-detail-view.component.html',
    imports: [Bind, Panel, TranslateDirective, RouterLink, Tag, AsyncPipe, TruncateTextPipe, TranslatePipe, DateTranslatePipe, GetRecordPipe, Nl2brPipe],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IllRequestDetailViewComponent {

  private recordService: RecordService = inject(RecordService);

  readonly record = input<any>();
  readonly type = input<string>('');

  readonly tagSeverity = computed(() => getTagSeverityFromStatus(this.record()?.metadata?.status));
  readonly loanTagSeverity = computed(() => getTagSeverityFromStatus(this.record()?.metadata?.loan_status));

  readonly requester = toSignal(
    toObservable(this.record).pipe(
      switchMap(r => {
        const pid = r?.metadata?.patron?.pid;
        if (!pid) return of(null);
        return this.recordService.getRecord('patrons', pid).pipe(map((p: any) => p.metadata));
      })
    ),
    { initialValue: null }
  );
}
