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
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { ApiService } from '@rero/ng-core';
import { AcqAccount } from 'projects/admin/src/app/acquisition/classes/account';

@Component({
  selector: 'admin-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['../../../acquisition.scss', './select-account.component.scss']
})
export class SelectAccountComponent extends FieldType implements OnInit {

  /** accounts list */
  accountList: Array<AcqAccount> = [];
  /** the selected account */
  selectedAccount: AcqAccount = null;
  /** currency */
  currency: string;

  /**
   * Constructor
   * @param _changeDetectorRef - ChangeDetectorRef
   * @param _apiService - ApiService
   */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _apiService: ApiService) {
    super();
  }

  /** OnInit Hook */
  ngOnInit() {
    this.to.options.forEach((option: any) => this.accountList.push(option));
    this.currency = this.to.currency;

    if (this.formControl.value) {
      const currentPid = this.formControl.value.substring(this.formControl.value.lastIndexOf('/') + 1);
      const currentAccount = this.accountList.find((account: AcqAccount) => account.pid === currentPid);
      if (currentAccount !== undefined) {
        this.selectedAccount = currentAccount;
      }
    }
  }

  /**
   * Store the selected option, when an option is clicked in the list
   * @param account - The selected account.
   */
  selectAccount(account: AcqAccount): void {
    const accountRef = this._apiService.getRefEndpoint('acq_accounts', account.pid);
    this.selectedAccount = account;
    this.formControl.patchValue(accountRef);
    this._changeDetectorRef.markForCheck();
  }
}
