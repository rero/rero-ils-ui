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
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { IAcqAccount } from '@app/admin/acquisition/classes/account';
import { FieldType } from '@ngx-formly/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ApiService } from '@rero/ng-core';
import { AppStore } from '@rero/shared';
import { MessageService } from 'primeng/api';
import { AcqAccountApiService } from '../../../../api/acq-account-api.service';
import { orderAccountsAsTree } from '../../../../utils/account';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet, CurrencyPipe } from '@angular/common';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'admin-select-account-editor-widget',
    templateUrl: './select-account-editor-widget.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, NgTemplateOutlet, CurrencyPipe, TranslatePipe, SelectModule]
})
export class SelectAccountEditorWidgetComponent extends FieldType implements OnInit {
  // services
  private acqAccountApiService: AcqAccountApiService = inject(AcqAccountApiService);
  private apiService: ApiService = inject(ApiService);
  private appStore = inject(AppStore);
  private messageService = inject(MessageService);
  private translateService: TranslateService = inject(TranslateService);

  // COMPONENT ATTRIBUTES =======================================================
  /** accounts list */
  accountList = signal<IAcqAccount[]>([]);
  /** the selected account */
  selectedAccount = signal<IAcqAccount | null>(null);
  /** loading state */
  loading = signal(false);
  /** organisation default currency */
  readonly defaultCurrency = computed(() => this.appStore.organisation()?.default_currency);

  ngOnInit(): void {
    this.loading.set(true);
    const libraryPid = this.appStore.currentLibraryPid();
    this.acqAccountApiService.getAccounts(libraryPid).subscribe({
      next: (accounts: IAcqAccount[]) => {
        accounts = orderAccountsAsTree(accounts);
        // filter me and my children to avoid backend recursion errors
        const accountPid = this.field.props?.editorConfig?.pid;
        if (this.field.props?.filterChildren && accountPid) {
          const newAccounts: IAcqAccount[] = [];
          const removed: string[] = [];
          accounts.forEach(account => {
            if (account.pid !== accountPid && !removed.some(pid => pid === account?.parent?.pid)) {
              newAccounts.push(account);
            } else {
              removed.push(account.pid!);
            }
          });
          this.accountList.set(newAccounts);
        } else {
          this.accountList.set(accounts);
        }

        if (this.formControl.value) {
          const currentPid = this.formControl.value.substring(this.formControl.value.lastIndexOf('/') + 1);
          const currentAccount = this.accountList().find((account: IAcqAccount) => account.pid === currentPid);
          if (currentAccount !== undefined) {
            this.selectedAccount.set(currentAccount);
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
      complete: () => this.loading.set(false),
    });
  }

  // COMPONENT FUNCTIONS ======================================================
  /**
   * Store the selected option, when an option is clicked in the list
   * @param account - The selected account.
   */
  selectAccount(event: { value: IAcqAccount | null }): void {
    const account = event.value;
    this.selectedAccount.set(account);
    if (account == null) {
      // reset the form control value, default value cannot be used as it is already filled by ngx formly
      this.formControl.reset(null);
      // reset the validators but the required validator
      const errors = this.formControl.errors;
      this.formControl.setErrors(errors?.required ? { required: true } : null);
      return;
    }
    const accountRef = this.apiService.getRefEndpoint('acq_accounts', account.pid);
    this.formControl.patchValue(accountRef);
  }
}
