// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
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
