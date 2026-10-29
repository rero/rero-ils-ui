// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { getTagSeverityFromStatus } from '@app/admin/utils/utils';
import { TranslatePipe } from '@ngx-translate/core';
import { Bind } from '@openng/optimus-ui/bind';
import { Panel } from '@openng/optimus-ui/panel';
import { Tag } from '@openng/optimus-ui/tag';
import { DateTranslatePipe, Nl2brPipe, RecordService, TruncateTextPipe } from '@rero/ng-core';
import { catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'admin-ill-request-detail-view',
  templateUrl: './ill-request-detail-view.component.html',
  imports: [Bind, Panel, RouterLink, Tag, TruncateTextPipe, TranslatePipe, DateTranslatePipe, Nl2brPipe],
})
export class IllRequestDetailViewComponent {
  private recordService: RecordService = inject(RecordService);

  readonly record = input<any>();
  readonly type = input<string>('');

  readonly tagSeverity = computed(() => getTagSeverityFromStatus(this.record()?.metadata?.status));
  readonly loanTagSeverity = computed(() => getTagSeverityFromStatus(this.record()?.metadata?.loan_status));

  readonly requester = toSignal(
    toObservable(this.record).pipe(
      switchMap((r) => {
        const pid = r?.metadata?.patron?.pid;
        if (!pid) return of(null);
        return this.recordService.getRecord('patrons', pid).pipe(
          map((p: any) => p.metadata),
          catchError(() => of(null)),
        );
      }),
    ),
    { initialValue: null },
  );

  readonly pickupName = toSignal(
    toObservable(this.record).pipe(
      switchMap((r) => {
        const pid = r?.metadata?.pickup_location?.pid;
        if (!pid) return of(null);
        return this.recordService.getRecord('locations', pid).pipe(
          map((l: any) => l.metadata.ill_pickup_name),
          catchError(() => of(null)),
        );
      }),
    ),
    { initialValue: null },
  );
}
