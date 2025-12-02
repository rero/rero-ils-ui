/*
 * RERO ILS UI
 * Copyright (C) 2025 RERO
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
import { Component, computed, inject, input, Input, OnDestroy, OnInit, Signal } from '@angular/core';
import { PatronTransactionEventApiService } from '../../../../api/patron-transaction-event-api.service';
import { PatronProfileMenuStore } from '../../../store/patron-profile-menu-store';
import { map, Subscription, switchMap } from 'rxjs';
import { EsResult, IOrganisation } from '@rero/shared';
import { Record } from '@rero/ng-core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { EsRecord } from 'projects/shared/src/public-api';

export interface PatronTransactionEvent {
  metadata: {
    pid: string;
    type: string;
    subtype?: string;
    amount?: number;
    note?: string;
    creation_date: string | Date;
    library?: {
      name: string;
    };
  };
}

@Component({
  selector: 'public-search-patron-profile-fee-event',
  templateUrl: './patron-profile-fee-event.component.html',
  standalone: false
})
export class PatronProfileFeeEventComponent {
  private api = inject(PatronTransactionEventApiService);
  private menuStore = inject(PatronProfileMenuStore);

  // Input signal
  event = input<PatronTransactionEvent>();

  // Organisation du patron
  organisation = computed<IOrganisation>(() => {
    const patron = this.menuStore.currentPatron();
    return patron ? patron.organisation : {} as IOrganisation;
  });

  // Récupération des events liés
  transactionEvents: Signal<any[]>= toSignal(
    toObservable(this.event).pipe(
      map(event => event.metadata.pid),
      switchMap((pid: string) => this.api.getEvents(pid)),
      map((response: EsResult) => response.hits.hits as PatronTransactionEvent[])
    ),
    { initialValue: [] }
  );

}
