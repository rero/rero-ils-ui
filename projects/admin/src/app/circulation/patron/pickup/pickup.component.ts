// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, switchMap } from 'rxjs/operators';
import { PatronService } from '../../../service/patron.service';
import { CirculationStore } from '../../store/circulation.store';
import { TranslateDirective } from '@ngx-translate/core';
import { PickupItemComponent } from './pickup-item/pickup-item.component';
import { Card } from 'primeng/card';

@Component({
    selector: 'admin-pickup',
    templateUrl: './pickup.component.html',
    imports: [TranslateDirective, PickupItemComponent, Card],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PickupComponent {

  private patronService: PatronService = inject(PatronService);
  protected store = inject(CirculationStore);

  loans = signal<any[] | undefined>(undefined);

  constructor() {
    toObservable(this.store.patron).pipe(
      takeUntilDestroyed(),
      filter(patron => !!patron),
      switchMap(patron => this.patronService.getItemsPickup(patron.pid))
    ).subscribe(loans => this.loans.set(loans));
  }

  cancelRequest(loanId: any): void {
    this.loans.update(loans => (loans ?? []).filter((element: any) => element.id !== loanId));
    this.store.loadStats(this.store.patron()!.pid);
  }
}
