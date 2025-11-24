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
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { PatronTransactionEventApiService } from '../../../../api/patron-transaction-event-api.service';
import { PatronProfileMenuStore } from '../../../store/patron-profile-menu-store';
import { Subscription } from 'rxjs';
import { IOrganisation } from '@rero/shared';
import { Record } from '@rero/ng-core';

@Component({
  selector: 'public-search-patron-profile-fee-event',
  templateUrl: './patron-profile-fee-event.component.html',
  standalone: false
})
export class PatronProfileFeeEventComponent implements OnInit, OnDestroy {
  private patronTransactionEventApiService: PatronTransactionEventApiService = inject(PatronTransactionEventApiService);
  private patronProfileMenuStore = inject(PatronProfileMenuStore);

  @Input() event;

  transactionEvents;

  private subscription = new Subscription();

  get organisation(): IOrganisation {
    const patron = this.patronProfileMenuStore.currentPatron();
    return patron ? patron.organisation : {} as IOrganisation;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.patronTransactionEventApiService.getEvents(this.event.metadata.pid).subscribe((response: Record) =>
        this.transactionEvents = response.hits.hits
      ));
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
