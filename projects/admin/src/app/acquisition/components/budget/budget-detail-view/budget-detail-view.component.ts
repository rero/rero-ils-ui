/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021 UCLouvain
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
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AcqBudgetApiService } from '../../../api/acq-budget-api.service';

@Component({
  selector: 'admin-budget-detail-view',
  templateUrl: './budget-detail-view.component.html'
})
export class BudgetDetailViewComponent implements DetailRecord, OnInit, OnDestroy {

  private budgetApiService: AcqBudgetApiService = inject(AcqBudgetApiService);
  private organisationService: OrganisationService = inject(OrganisationService);

  // COMPONENT ATTRIBUTES =====================================================
  /** Record observable */
  record$: Observable<any>;
  /** Record type */
  type: string;
  /** Budget total allocated amount */
  totalAmount = 0;

  /** all component subscription */
  private _subscriptions = new Subscription();

  // GETTER & SETTER ==========================================================
  /** Get the currency code used for the current loaded organisation */
  get currencyCode(): string {
    return this.organisationService.organisation.default_currency;
  }

  /** OnInit hook */
  ngOnInit() {
    this._subscriptions.add(
      this.record$
        .pipe(switchMap((record: any) => this.budgetApiService.getBudgetTotalAmount(record.metadata.pid)))
        .subscribe(total => this.totalAmount = total));
  }

  ngOnDestroy(): void {
      this._subscriptions.unsubscribe();
  }
}
