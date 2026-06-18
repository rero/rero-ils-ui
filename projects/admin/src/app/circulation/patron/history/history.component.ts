// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RecordService } from '@rero/ng-core';
import { filter, map, switchMap } from 'rxjs/operators';
import { OperationLogsApiService } from '@rero/shared';
import { CirculationStore } from '../../store/circulation.store';
import { TranslateDirective, TranslatePipe } from '@ngx-translate/core';
import { HistoryLogComponent } from './history-log/history-log.component';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'admin-history',
    templateUrl: './history.component.html',
    imports: [TranslateDirective, HistoryLogComponent, TranslatePipe, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HistoryComponent {

  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private store = inject(CirculationStore);

  historyLogs = toSignal(
    toObservable(this.store.patron).pipe(
      filter((patron): patron is any => !!patron),
      switchMap(patron =>
        this.operationLogsApiService.getCheckInHistory(patron.pid, 1, RecordService.MAX_REST_RESULTS_SIZE).pipe(
          map((result: any) => result.hits.hits)
        )
      )
    ),
    { initialValue: null }
  );
}
