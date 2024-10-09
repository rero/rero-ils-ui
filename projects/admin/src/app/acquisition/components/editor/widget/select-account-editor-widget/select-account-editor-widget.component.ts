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
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IAcqAccount } from '@app/admin/acquisition/classes/account';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { FieldType } from '@ngx-formly/core';
import { ApiService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { AcqAccountApiService } from '../../../../api/acq-account-api.service';
import { orderAccountsAsTree } from '../../../../utils/account';

@Component({
  selector: 'admin-select-account-editor-widget',
  templateUrl: './select-account-editor-widget.component.html',
  styleUrls: ['../../../../acquisition.scss', './select-account-editor-widget.component.scss']
})
export class SelectAccountEditorWidgetComponent extends FieldType implements OnInit {

  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private apiService: ApiService = inject(ApiService);
  private userService: UserService = inject(UserService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  // COMPONENT ATTRIBUTES =======================================================
  /** accounts list */
  accountList: IAcqAccount[] = [];
  /** the selected account */
  selectedAccount: IAcqAccount = null;

  // GETTER & SETTER ============================================================
  /** Get the current organisation */
  get organisation(): any {
    return this.organisationService.organisation;
  }

  /** Get the currency symbol for the organisation */
  get currencySymbol(): any {
    return getCurrencySymbol(this.organisation.default_currency, 'wide');
  }

  /** OnInit hook */
  ngOnInit(): void {
    const libraryPid = this.userService.user.currentLibrary;
    this.acqAccountApiService.getAccounts(libraryPid).subscribe((accounts: IAcqAccount[]) => {
      accounts = orderAccountsAsTree(accounts);
      this.accountList = accounts;

      if (this.formControl.value) {
        const currentPid = this.formControl.value.substring(this.formControl.value.lastIndexOf('/') + 1);
        const currentAccount = this.accountList.find((account: IAcqAccount) => account.pid === currentPid);
        if (currentAccount !== undefined) {
          this.selectedAccount = currentAccount;
          this.changeDetectorRef.markForCheck();
        }
      }
    });
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Store the selected option, when an option is clicked in the list
   * @param account - The selected account.
   */
  selectAccount(account: IAcqAccount): void {
    const accountRef = this.apiService.getRefEndpoint('acq_accounts', account.pid);
    this.selectedAccount = account;
    this.formControl.patchValue(accountRef);
    this.changeDetectorRef.markForCheck();
  }
}
