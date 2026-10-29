// SPDX-FileCopyrightText: Fondation RERO+
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Card } from '@openng/optimus-ui/card';
import { filter, switchMap } from 'rxjs/operators';

import { PatronService } from '../../../service/patron.service';
import { CirculationStore } from '../../store/circulation.store';
import { PickupItemComponent } from './pickup-item/pickup-item.component';

@Component({
  selector: 'admin-pickup',
  templateUrl: './pickup.component.html',
  imports: [TranslatePipe, PickupItemComponent, Card],
})
export class PickupComponent {
  private patronService: PatronService = inject(PatronService);
  protected store = inject(CirculationStore);

  loans = signal<any[] | undefined>(undefined);

  constructor() {
    toObservable(this.store.patron)
      .pipe(
        takeUntilDestroyed(),
        filter((patron) => !!patron),
        switchMap((patron) => this.patronService.getItemsPickup(patron.pid)),
      )
      .subscribe((loans) => this.loans.set(loans));
  }

  cancelRequest(loanId: any): void {
    this.loans.update((loans) => (loans ?? []).filter((element: any) => element.id !== loanId));
    this.store.loadStats(this.store.patron()!.pid);
  }
}
