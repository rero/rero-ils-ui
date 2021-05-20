/*
 * RERO ILS UI
 * Copyright (C) 2019 RERO
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
import { Component, OnInit } from '@angular/core';
import { DetailRecord } from '@rero/ng-core/lib/record/detail/view/detail-record';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';
import { AcqBudgetApiService } from '../../../api/acq-budget-api.service';

@Component({
  selector: 'admin-budget-detail-view',
  templateUrl: './budget-detail-view.component.html'
})
export class BudgetDetailViewComponent implements DetailRecord, OnInit {

  // COMPONENT ATTRIBUTES =====================================================
  /** Record observable */
  record$: Observable<any>;
  /** Record type */
  type: string;
  /** Budget total allocated amount */
  totalAmount = 0;

  // GETTER & SETTER ==========================================================
  /** Get the current language used for the interface */
  get language(): string {
    return this._translateService.currentLang;
  }

  /** Get the currency code used for the current loaded organisation */
  get currencyCode(): string {
    return this._organisationService.organisation.default_currency;
  }

  // CONSTRUCTOR & HOOKS ======================================================
  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _budgetApiService - AcqBudgetApiService
   * @param _organisationService - OrganisationService
   */
  constructor(
    private _translateService: TranslateService,
    private _budgetApiService: AcqBudgetApiService,
    private _organisationService: OrganisationService
  ) {}

  /** OnInit hook */
  ngOnInit() {
    this.record$.subscribe(record => {
      this._budgetApiService.getBudgetTotalAmount(record.metadata.pid).subscribe(total => this.totalAmount = total);
    });
  }
}
