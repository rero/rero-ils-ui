/*
 * RERO ILS UI
 * Copyright (C) 2021 RERO
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

import { getCurrencySymbol } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { ToastrService } from 'ngx-toastr';
import { OrganisationService } from 'projects/admin/src/app/service/organisation.service';
import { IAcqAccount } from '../../../classes/account';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { orderAccountsAsTree } from '../../../utils/account';

@Component({
  selector: 'admin-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['../../../acquisition.scss']
})
export class AccountTransferComponent implements OnInit {

  // COMPONENT ATTRIBUTES =======================================================
  /** the accounts available for transfer */
  accountsToDisplay: IAcqAccount[] = [];
  /** active budgets */
  budgets: string[] = [];
  /** the transfer form group */
  form: UntypedFormGroup;

  /** the accounts available for transfer */
  private _accountsTree: IAcqAccount[] = [];
  /** store the selected budgets */
  private _selectedBudgetPid: string = undefined;

  // GETTER & SETTER ============================================================
  /** Get the current organisation */
  get organisation(): any {
    return this._organisationService.organisation;
  }

  /** Get the currency symbol for the organisation */
  get currencySymbol(): any {
    return getCurrencySymbol(this.organisation.default_currency, 'wide');
  }

  // CONSTRUCTOR & HOOKS ========================================================
  /**
   * Constructor
   * @param _acqAccountApiService - AcqAccountApiService
   * @param _organisationService - OrganisationService
   * @param _formBuilder - FormBuilder,
   * @param _toastrService - ToastrService,
   * @param _translateService - TranslateService
   * @param _router - Router
   * @param _userService - UserService
   */
  constructor(
    private _acqAccountApiService: AcqAccountApiService,
    private _organisationService: OrganisationService,
    private _formBuilder: UntypedFormBuilder,
    private _toastrService: ToastrService,
    private _translateService: TranslateService,
    private _router: Router,
    private _userService: UserService
  ) {
    this.form = this._formBuilder.group({
      source: [undefined, Validators.required],
      target: [undefined, Validators.required],
      amount: [0, Validators.min(0.01)]
    });
  }

  /** OnInit hook */
  ngOnInit(): void {
    this._loadData();
    this.form.controls.source.valueChanges.subscribe((account: IAcqAccount) => {
      const maxTransferAmount = account.remaining_balance.self;
      this.form.controls.amount.setValidators([
        Validators.min(0.01),
        Validators.max(maxTransferAmount)
      ]);
    });
  }

  // PUBLIC FUNCTIONS =========================================================
  /** get the URL to access account detail view */
  getDetailUrl(account: IAcqAccount): string[] {
    return ['/', 'records', 'acq_accounts', 'detail', account.pid];
  }

  /** Handle event when a budget is selected */
  selectBudget(event: any): void {
    this._selectedBudgetPid = event.target.value;
    this._filterAccountToDisplay();
  }

  /**
   * Handle event when use choose source/target account
   * @param destination - the account destination (source || target)
   * @param account - the selected account.
   */
  selectAccount(destination: string, account: IAcqAccount): void {
    this.form.controls[destination].patchValue(account);
  }

  /** Submit the form */
  submit(): void {
    this._acqAccountApiService
      .transferFunds(this.form.value.source.pid, this.form.value.target.pid, this.form.value.amount)
      .subscribe(
        () => {
          this._toastrService.success(this._translateService.instant('Fund transfer successful!'));
          this._router.navigate(['/', 'acquisition', 'accounts']);
        },
        (err) => { this._toastrService.error(this._translateService.instant(err.error.message)); }
      );
  }

  /**
   * Check an input form field to know if it's valid
   * @param fieldName - the field name to check
   */
  checkInput(fieldName: string): boolean {
    if (this.form.get(fieldName) === undefined) {
      return true;
    }
    return this.form.get(fieldName).invalid
        && this.form.get(fieldName).errors
        && (this.form.get(fieldName).dirty || this.form.get(fieldName).touched);
  }

  // PRIVATE FUNCTIONS ========================================================
  /** Load accounts and budgets. Order accounts as a hierarchical tree */
  private _loadData(): void {
    const libraryPid = this._userService.user.currentLibrary;
    this._acqAccountApiService
      .getAccounts(libraryPid, undefined, {sort: 'depth'})
      .subscribe((accounts: IAcqAccount[]) => {
        this._accountsTree = orderAccountsAsTree(accounts);
        this.budgets = Array.from(new Set(this._accountsTree.map((account: IAcqAccount) => account.budget.pid)));
        this._selectedBudgetPid = this.budgets.find(Boolean);  // get the first element
        this._filterAccountToDisplay();
      });
  }

  /** Allow to filter loaded accounts by the selected budget */
  private _filterAccountToDisplay(): void {
    this.accountsToDisplay = this._accountsTree.filter((acc: IAcqAccount) => acc.budget.pid === this._selectedBudgetPid);
  }

}
