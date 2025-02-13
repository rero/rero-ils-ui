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
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { IAcqAccount } from '@app/admin/acquisition/classes/account';
import { OrganisationService } from '@app/admin/service/organisation.service';
import { FieldType } from '@ngx-formly/core';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@rero/ng-core';
import { UserService } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { AcqAccountApiService } from '../../../../api/acq-account-api.service';
import { orderAccountsAsTree } from '../../../../utils/account';

@Component({
  selector: 'admin-select-account-editor-widget',
  templateUrl: './select-account-editor-widget.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class SelectAccountEditorWidgetComponent extends FieldType implements OnInit {
  // services
  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private organisationService: OrganisationService = inject(OrganisationService);
  private apiService: ApiService = inject(ApiService);
  private userService: UserService = inject(UserService);
  private messageService = inject(MessageService);
  private translateService: TranslateService = inject(TranslateService);
  private changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);

  // COMPONENT ATTRIBUTES =======================================================
  /** accounts list */
  accountList: IAcqAccount[] = [];
  /** the selected account */
  selectedAccount: IAcqAccount = null;
  // loading wheels
  loading: boolean = false;
  // currency
  defaultCurrency: string;

  ngOnInit(): void {
    this.loading = true;
    const libraryPid = this.userService.user.currentLibrary;
    this.defaultCurrency = this.organisationService.organisation.default_currency;
    this.acqAccountApiService.getAccounts(libraryPid).subscribe({
      next: (accounts: IAcqAccount[]) => {
        accounts = orderAccountsAsTree(accounts);
        // filter me and my children to avoid backend recursion errors
        let accountPid = this.field.props.editorConfig.pid;
        if(accountPid) {
          let newAccounts = [];
          let removed = [];
          accounts.map(account => {
            if (account.pid !== accountPid && !removed.some(removedAccountPid => removedAccountPid === account?.parent?.pid)) {
              newAccounts.push(account);
            } else {
              removed.push(account.pid);
            }
          });
          this.accountList = newAccounts;
        } else {
          this.accountList = accounts;
        }

        if (this.formControl.value) {
          const currentPid = this.formControl.value.substring(this.formControl.value.lastIndexOf('/') + 1);
          const currentAccount = this.accountList.find((account: IAcqAccount) => account.pid === currentPid);
          if (currentAccount !== undefined) {
            this.selectedAccount = currentAccount;
          }
        }
      },
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('Acquisition accounts'),
          detail: this.translateService.instant('An error has occurred. Please try again.'),
          sticky: true,
          closable: true,
        }),
      complete: () => {
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Store the selected option, when an option is clicked in the list
   * @param account - The selected account.
   */
  selectAccount(event): void {
    const account: IAcqAccount = event.value;
    if (account == null) {
      // reset the form control value, default value cannot be used as it is already filled by ngx formly
      this.formControl.reset(null);
      // reset the validators but the required validator
      const errors = this.formControl.errors;
      this.formControl.setErrors(errors.required? {required: true}: null);
      return;
    }
    const accountRef = this.apiService.getRefEndpoint('acq_accounts', account.pid);
    this.formControl.patchValue(accountRef);
  }
}
