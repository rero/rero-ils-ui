// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { CardModule } from '@openng/optimus-ui/card';
import { RecordService } from '@rero/ng-core';
import { OperationLogsApiService } from '@rero/shared';
import { filter, map, switchMap } from 'rxjs/operators';

import { CirculationStore } from '../../store/circulation.store';
import { HistoryLogComponent } from './history-log/history-log.component';

@Component({
  selector: 'admin-history',
  templateUrl: './history.component.html',
  imports: [HistoryLogComponent, TranslatePipe, CardModule],
})
export class HistoryComponent {
  private operationLogsApiService: OperationLogsApiService = inject(OperationLogsApiService);
  private store = inject(CirculationStore);

  historyLogs = toSignal(
    toObservable(this.store.patron).pipe(
      filter((patron): patron is any => !!patron),
      switchMap((patron) =>
        this.operationLogsApiService
          .getCheckInHistory(patron.pid, 1, RecordService.MAX_REST_RESULTS_SIZE)
          .pipe(map((result: any) => result.hits.hits)),
      ),
    ),
    { initialValue: null },
  );
}
