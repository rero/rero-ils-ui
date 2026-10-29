// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-FileCopyrightText: UCLouvain
// SPDX-License-Identifier: AGPL-3.0-or-later
import { Component, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { IllRequestApiService } from '@app/admin/api/ill-request-api.service';
import { TranslatePipe } from '@ngx-translate/core';
import { CardModule } from '@openng/optimus-ui/card';
import { filter, switchMap } from 'rxjs/operators';

import { CirculationStore } from '../../store/circulation.store';
import { IllRequestItemComponent } from './ill-request-item/ill-request-item.component';

@Component({
  selector: 'admin-ill-request',
  templateUrl: './ill-request.component.html',
  imports: [TranslatePipe, IllRequestItemComponent, CardModule],
})
export class IllRequestComponent {
  private illRequestApiService: IllRequestApiService = inject(IllRequestApiService);
  private store = inject(CirculationStore);

  illRequests = toSignal(
    toObservable(this.store.patron).pipe(
      filter((patron): patron is any => !!patron),
      switchMap((patron) => this.illRequestApiService.getByPatronPid(patron.pid, { remove_archived: '1' })),
    ),
    { initialValue: null },
  );
}
