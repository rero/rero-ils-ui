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
import { Component, Input, OnInit, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RecordService } from '@rero/ng-core';
import { Record } from '@rero/ng-core/lib/record/record';
import { BudgetTotalService } from 'projects/admin/src/app/service/budget-total.service';
import { UserService } from 'projects/admin/src/app/service/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'admin-acquisition-accounts',
  templateUrl: './acquisition-accounts.component.html'
})
export class AcquisitionAccountsComponent implements OnInit {

  /**
   * Budget pid
   */
  @Input() budgetPid: string;

  /**
   * Currency code
   */
  @Input() currencyCode: string;

  /**
   * accounts
   */
  accounts: Array<any>;

  /**
   * Constructor
   * @param _userService - UserService
   * @param _recordService - RecordService
   * @param _budgetTotalService - BudgetTotalService
   */
  constructor(
    private _userService: UserService,
    private _recordService: RecordService,
    private _budgetTotalService: BudgetTotalService
  ) { }

  /**
   * Init
   */
  ngOnInit() {
    this._loadAcqAccounts();
  }

  /**
   * Delete acquisition account
   * @param acqAccountPid - string
   */
  delete(acqAccountPid: string) {
    this.accounts = this.accounts.filter(
      acqAccount => acqAccountPid !== acqAccount.metadata.pid
    );
  }

  /**
   * Load acquisition accounts for current budget
   */
  private _loadAcqAccounts() {
    const currentLibrary = this._userService.getCurrentUser().getCurrentLibrary();
    const query = `budget.pid:${this.budgetPid} AND library.pid:${currentLibrary}`;
    this._recordService
        .getRecords('acq_accounts', query, 1, RecordService.MAX_REST_RESULTS_SIZE)
        .pipe(
          map((hits: Record) => this._recordService.totalHits(hits.hits.total) === 0 ? [] : hits.hits.hits)
        ).subscribe((accounts: any) => {
          this.accounts = accounts;
          accounts.map((record: any) => {
            if (record.metadata.amount_allocated) {
              this._budgetTotalService.addAmount(record.metadata.amount_allocated);
            }
          });
        });
  }
}
