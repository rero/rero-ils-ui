/*
 * RERO ILS UI
 * Copyright (C) 2020-2025 RERO
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
