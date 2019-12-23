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
import { Component, Input, OnDestroy } from '@angular/core';
import { RecordService } from '@rero/ng-core';
import { ToastrService } from 'ngx-toastr';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-budget-select-line',
  templateUrl: './budget-select-line.component.html'
})
export class BudgetSelectLineComponent implements OnDestroy {

  /**
   * Budget record
   */
  @Input() budget: any;

  /**
   * Organisation record
   */
  @Input() organisation: any;

  /**
   * Store some observables on Subcription
   */
  private _subcription = new Subscription();

  /**
   *
   * @param _recordService - RecordService
   * @param _toastrService - ToastrService
   * @param _translateService - TranslateService
   */
  constructor(
    private _recordService: RecordService,
    private _toastrService: ToastrService,
    private _translateService: TranslateService
  ) { }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this._subcription.unsubscribe();
  }

  /**
   * Is checked
   * @param budgetPid - boolean
   */
  isChecked(budgetPid: string) {
    return this.organisation.metadata.current_budget_pid === budgetPid;
  }

  /**
   * Update Budget Pid on Organisation
   * @param event - any
   */
  updateOrganisationBudgetPid(event: any) {
    const budgetPid = event.target.id;
    const budgetName = event.target.dataset.budgetname;
    if (this.organisation.metadata.current_budget_pid !== budgetPid) {
      this.organisation.metadata.current_budget_pid = event.target.id;
      this._subcription.add(
        this._recordService.update('organisations', this.organisation.metadata)
        .subscribe(() => {
          const message = this._translateService.instant(
            `The organisation\'s active budget is now on {{ budgetName }}`,
            { budgetName }
          );
          this._toastrService.success(message);
        })
      );
    }
  }
}
