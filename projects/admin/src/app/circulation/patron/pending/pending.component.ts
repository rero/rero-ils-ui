// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';
import { PatronService } from '../../../service/patron.service';
import { CirculationStore } from '../../store/circulation.store';
import { TranslateDirective } from '@ngx-translate/core';
import { PendingItemComponent } from './pending-item/pending-item.component';
import { Card } from 'primeng/card';

@Component({
    selector: 'admin-pending',
    templateUrl: './pending.component.html',
    imports: [TranslateDirective, PendingItemComponent, Card],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PendingComponent {

  private patronService: PatronService = inject(PatronService);
  protected store = inject(CirculationStore);

  loans = signal<any[] | undefined>(undefined);

  constructor() {
    toObservable(this.store.patron).pipe(
      takeUntilDestroyed(),
      filter(patron => !!patron),
      switchMap(patron => this.patronService.getItemsRequested(patron.pid))
    ).subscribe(loans => this.loans.set(loans));
  }

  cancelRequest(loanId: any): void {
    this.loans.update(loans => (loans ?? []).filter((element: any) => element.id !== loanId));
    this.store.loadStats(this.store.patron()!.pid);
  }
}
