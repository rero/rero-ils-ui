/*
 * RERO ILS UI
 * Copyright (C) 2021-2024 RERO
 * Copyright (C) 2021-2023 UCLouvain
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
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IAcqAccount } from '@app/admin/acquisition/classes/account';
import { FieldType } from '@ngx-formly/core';
import { ApiService } from '@rero/ng-core';

@Component({
  selector: 'admin-select-account',
  templateUrl: './select-account.component.html',
  styleUrls: ['../../../acquisition.scss', './select-account.component.scss']
})
export class SelectAccountComponent extends FieldType implements OnInit {

  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private apiService: ApiService = inject(ApiService);

  /** accounts list */
  accountList: IAcqAccount[] = [];
  /** the selected account */
  selectedAccount: IAcqAccount = null;
  /** currency */
  currency: string;

  /** OnInit Hook */
  ngOnInit() {
    this.props.options.forEach((option: any) => this.accountList.push(option));
    this.currency = this.props.currency;

    if (this.formControl.value) {
      const currentPid = this.formControl.value.substring(this.formControl.value.lastIndexOf('/') + 1);
      const currentAccount = this.accountList.find((account: IAcqAccount) => account.pid === currentPid);
      if (currentAccount !== undefined) {
        this.selectedAccount = currentAccount;
      }
    }
  }

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
