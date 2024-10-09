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

import { getCurrencySymbol } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { AcqAccountApiService } from '../../../api/acq-account-api.service';
import { IAcqAccount } from '../../../classes/account';
import { orderAccountsAsTree } from '../../../utils/account';

@Component({
  selector: 'admin-account-transfer',
  templateUrl: './account-transfer.component.html',
  styleUrls: ['../../../acquisition.scss']
})
export class AccountTransferComponent implements OnInit {

  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private formBuilder: UntypedFormBuilder = inject(UntypedFormBuilder);
  private translateService: TranslateService = inject(TranslateService);
  private router: Router = inject(Router);
  private userService: UserService = inject(UserService);
  private messageService = inject(MessageService);

  // COMPONENT ATTRIBUTES =======================================================
  /** the accounts available for transfer */
  accountsToDisplay: IAcqAccount[] = [];
  /** active budgets */
  budgets: string[] = [];
  /** the transfer form group */
  form: UntypedFormGroup;

  /** the accounts available for transfer */
  private accountsTree: IAcqAccount[] = [];
  /** store the selected budgets */
  private selectedBudgetPid: string = undefined;

  // GETTER & SETTER ============================================================
  /** Get the current organisation */
  get organisation(): any {
    return this.organisationService.organisation;
  }

  /** Get the currency symbol for the organisation */
  get currencySymbol(): any {
    return getCurrencySymbol(this.organisation.default_currency, 'wide');
  }

  // CONSTRUCTOR & HOOKS ========================================================
  constructor() {
    this.form = this.formBuilder.group({
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
    this.selectedBudgetPid = event.target.value;
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
    this.acqAccountApiService
      .transferFunds(this.form.value.source.pid, this.form.value.target.pid, this.form.value.amount)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('Account'),
            detail: this.translateService.instant('Fund transfer successful!')
          });
          this.router.navigate(['/', 'acquisition', 'accounts']);
        },
        error: (err) => this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Account'),
          detail:this.translateService.instant(err.error.message)
        }),
    });
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
    const libraryPid = this.userService.user.currentLibrary;
    this.acqAccountApiService
      .getAccounts(libraryPid, undefined, {sort: 'depth'})
      .subscribe((accounts: IAcqAccount[]) => {
        this.accountsTree = orderAccountsAsTree(accounts);
        this.budgets = Array.from(new Set(this.accountsTree.map((account: IAcqAccount) => account.budget.pid)));
        this.selectedBudgetPid = this.budgets.find(Boolean);  // get the first element
        this._filterAccountToDisplay();
      });
  }

  /** Allow to filter loaded accounts by the selected budget */
  private _filterAccountToDisplay(): void {
    this.accountsToDisplay = this.accountsTree.filter((acc: IAcqAccount) => acc.budget.pid === this.selectedBudgetPid);
  }
}
