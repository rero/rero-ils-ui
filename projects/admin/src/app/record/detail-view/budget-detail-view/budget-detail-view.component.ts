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
import { BudgetTotalService } from '../../../service/budget-total.service';
import { OrganisationService } from '../../../service/organisation.service';

@Component({
  selector: 'admin-budget-detail-view',
  templateUrl: './budget-detail-view.component.html'
})
export class BudgetDetailViewComponent implements DetailRecord, OnInit {

  /**
   * Record observable
   */
  record$: Observable<any>;

  /**
   * Type
   */
  type: string;

  /**
   * Language
   * @return string - current language
   */
  get language(): string {
    return this._translateService.currentLang;
  }

  /**
   * Return current code for current organisation
   * @return currency code - string
   */
  get currencyCode(): string {
    return this._organisationService.organisation.default_currency;
  }

  /**
   * Return Observable of total budget
   * @return Observable
   */
  get total$() {
    return this._budgetTotalService.onTotalChanged$;
  }

  /**
   * Constructor
   * @param _translateService - TranslateService
   * @param _budgetTotalService - BudgetTotalService
   * @param _organisationService - OrganisationService
   */
  constructor(
    private _translateService: TranslateService,
    private _budgetTotalService: BudgetTotalService,
    private _organisationService: OrganisationService
  ) {}

  /**
   * Init
   */
  ngOnInit() {
    this._budgetTotalService.reset();
  }
}
